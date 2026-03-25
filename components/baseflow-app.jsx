'use client';

import { useEffect, useMemo, useState } from 'react';
import sdk from '@farcaster/frame-sdk';
import {
  useAccount,
  useConnect,
  useDisconnect,
  usePublicClient,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import { baseFlowAbi, CONTRACT_ADDRESS } from '@/lib/baseflow';
import { siteConfig, statusLabels } from '@/lib/site';
import { decodeTaskText, encodeTaskText, normalizeStatus, shortenAddress } from '@/lib/utils';
import { trackTransaction } from '@/utils/track';

function ConnectButtons() {
  const { connect, connectors, isPending } = useConnect();

  return (
    <div className="action-row">
      {connectors.map((connector) => (
        <button
          key={connector.uid}
          className="button button-secondary"
          onClick={() => connect({ connector })}
          disabled={isPending}
          type="button"
        >
          Connect {connector.name}
        </button>
      ))}
    </div>
  );
}

function StatusBadge({ status }) {
  const safeStatus = normalizeStatus(status);
  return (
    <span className={`status-badge status-${statusLabels[safeStatus].toLowerCase()}`}>
      {statusLabels[safeStatus]}
    </span>
  );
}

export function BaseFlowApp() {
  const [content, setContent] = useState('');
  const [taskId, setTaskId] = useState('0');
  const [taskStatus, setTaskStatus] = useState('1');
  const [message, setMessage] = useState('Ready to connect and manage BaseFlow tasks.');
  const [loadedTasks, setLoadedTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [refreshTick, setRefreshTick] = useState(0);
  const [lastAction, setLastAction] = useState(null);
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const publicClient = usePublicClient();
  const { data: taskCount } = useReadContract({
    abi: baseFlowAbi,
    address: CONTRACT_ADDRESS,
    functionName: 'taskCount',
    query: { refetchInterval: 12000 },
  });
  const { writeContract, data: txHash, isPending: isWriting } = useWriteContract();
  const receipt = useWaitForTransactionReceipt({ hash: txHash });

  useEffect(() => {
    sdk.actions.ready().catch(() => {});
  }, []);

  useEffect(() => {
    if (receipt.isSuccess && txHash && address && lastAction !== txHash) {
      trackTransaction('app-001', 'BaseFlow', address, txHash);
      setLastAction(txHash);
      setMessage(`Transaction confirmed: ${txHash}`);
      setContent('');
      setRefreshTick((value) => value + 1);
    }
  }, [address, lastAction, receipt.isSuccess, txHash]);

  useEffect(() => {
    if (receipt.isError) {
      setMessage('Transaction failed. Please try again.');
    }
  }, [receipt.isError]);

  useEffect(() => {
    if (!isConnected || !address || !publicClient) {
      setLoadedTasks([]);
      return;
    }

    let cancelled = false;

    async function loadTasks() {
      setLoadingTasks(true);
      try {
        const ids = await publicClient.readContract({
          abi: baseFlowAbi,
          address: CONTRACT_ADDRESS,
          functionName: 'getUserTasks',
          args: [address],
        });

        const recentIds = [...ids].slice(-6).reverse();
        const taskEntries = await Promise.all(
          recentIds.map(async (id) => {
            const [rawContent, rawStatus, owner] = await publicClient.readContract({
              abi: baseFlowAbi,
              address: CONTRACT_ADDRESS,
              functionName: 'getTask',
              args: [id],
            });

            return {
              id: Number(id),
              owner,
              content: decodeTaskText(rawContent),
              status: normalizeStatus(rawStatus),
            };
          }),
        );

        if (!cancelled) {
          setLoadedTasks(taskEntries);
        }
      } catch {
        if (!cancelled) {
          setMessage('Connected, but task history could not be loaded right now.');
        }
      } finally {
        if (!cancelled) {
          setLoadingTasks(false);
        }
      }
    }

    loadTasks();
    return () => {
      cancelled = true;
    };
  }, [address, isConnected, publicClient, refreshTick]);

  const stats = useMemo(() => {
    return [
      { label: 'Chain', value: 'Base Mainnet' },
      { label: 'Contract', value: 'Live' },
      { label: 'Tracked App ID', value: 'app-001' },
      { label: 'Tasks Recorded', value: taskCount ? taskCount.toString() : 'Loading' },
    ];
  }, [taskCount]);

  function createTask() {
    if (!content.trim()) {
      setMessage('Enter a short note or task before sending.');
      return;
    }

    setMessage('Waiting for wallet confirmation...');
    writeContract({
      abi: baseFlowAbi,
      address: CONTRACT_ADDRESS,
      functionName: 'createTask',
      args: [encodeTaskText(content)],
    });
  }

  function updateTaskStatus() {
    setMessage('Sending status update...');
    writeContract({
      abi: baseFlowAbi,
      address: CONTRACT_ADDRESS,
      functionName: 'updateStatus',
      args: [BigInt(taskId || '0'), Number(taskStatus)],
    });
  }

  return (
    <main className="page-shell">
      <section className="hero">
        <div className="hero-grid">
          <div>
            <span className="eyebrow">Base mini app / task + note flow</span>
            <h1>Track work onchain with fewer clicks and lower gas.</h1>
            <p>
              BaseFlow gives teams a fast way to create task records, update execution state, and
              query recent notes from a compressed event-driven contract on Base.
            </p>
          </div>
          <div className="wallet-card">
            <div className="inline-between">
              <strong>Wallet</strong>
              <span className="pill">{isConnected ? 'Connected' : 'Not connected'}</span>
            </div>
            <div className="wallet-list">
              <div>
                <div className="caption">Connected address</div>
                <div className="mono">{address ? shortenAddress(address) : 'Connect to start'}</div>
              </div>
              {!isConnected ? (
                <ConnectButtons />
              ) : (
                <div className="action-row">
                  <button className="button button-secondary" onClick={() => disconnect()} type="button">
                    Disconnect
                  </button>
                </div>
              )}
              <div className="caption">{message}</div>
            </div>
          </div>
        </div>

        <div className="stat-row">
          {stats.map((stat) => (
            <div className="stat-card" key={stat.label}>
              <strong>{stat.value}</strong>
              <span className="caption">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="grid-two">
        <div className="panel">
          <div className="panel-header">
            <div>
              <h2>Create a Task Note</h2>
              <p className="muted">The contract stores each note as compressed bytes32 content.</p>
            </div>
            <span className="pill">Write</span>
          </div>

          <div className="field">
            <label htmlFor="content">Task or note</label>
            <input
              id="content"
              className="input"
              maxLength={31}
              onChange={(event) => setContent(event.target.value)}
              placeholder="Ship landing page copy"
              value={content}
            />
            <span className="caption">Up to 31 ASCII characters to fit the contract storage format.</span>
          </div>

          <button className="button button-primary" disabled={!isConnected || isWriting} onClick={createTask} type="button">
            {isWriting ? 'Waiting...' : 'Create Onchain Task'}
          </button>
        </div>

        <div className="panel">
          <div className="panel-header">
            <div>
              <h2>Advance Task Status</h2>
              <p className="muted">Move tasks through Todo, Doing, and Done without leaving Base.</p>
            </div>
            <span className="pill">Update</span>
          </div>

          <div className="field-grid">
            <div className="field">
              <label htmlFor="taskId">Task ID</label>
              <input
                id="taskId"
                className="input"
                inputMode="numeric"
                onChange={(event) => setTaskId(event.target.value)}
                value={taskId}
              />
            </div>
            <div className="select-field">
              <label htmlFor="taskStatus">New status</label>
              <select
                id="taskStatus"
                className="select"
                onChange={(event) => setTaskStatus(event.target.value)}
                value={taskStatus}
              >
                <option value="0">Todo</option>
                <option value="1">Doing</option>
                <option value="2">Done</option>
              </select>
            </div>
          </div>

          <button className="button button-primary" disabled={!isConnected || isWriting} onClick={updateTaskStatus} type="button">
            {isWriting ? 'Waiting...' : 'Update Status'}
          </button>
        </div>
      </section>

      <section className="grid-two">
        <div className="panel">
          <div className="panel-header">
            <div>
              <h3>Recent Wallet Tasks</h3>
              <p className="muted">Latest records loaded directly from the contract for your address.</p>
            </div>
            <button
              className="button button-ghost"
              onClick={() => setRefreshTick((value) => value + 1)}
              type="button"
            >
              Refresh
            </button>
          </div>

          <div className="task-list">
            {loadingTasks ? <div className="task-item">Loading tasks...</div> : null}
            {!loadingTasks && loadedTasks.length === 0 ? (
              <div className="task-item">Connect a wallet to see your latest BaseFlow tasks.</div>
            ) : null}
            {loadedTasks.map((task) => (
              <article className="task-item" key={task.id}>
                <header>
                  <h4>Task #{task.id}</h4>
                  <StatusBadge status={task.status} />
                </header>
                <div>{task.content}</div>
                <div className="caption mono">{task.owner}</div>
              </article>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <div>
              <h3>Launch Metadata</h3>
              <p className="muted">Production metadata is wired for Base app discovery, previews, and verification.</p>
            </div>
            <span className="pill">Live</span>
          </div>

          <div className="meta-list">
            <div>
              <strong>Name</strong>
              <div className="caption">{siteConfig.name}</div>
            </div>
            <div>
              <strong>Category</strong>
              <div className="caption">{siteConfig.primaryCategory}</div>
            </div>
            <div>
              <strong>Canonical URL</strong>
              <div className="caption mono">{siteConfig.url}</div>
            </div>
            <div>
              <strong>Contract</strong>
              <div className="caption mono">{CONTRACT_ADDRESS}</div>
            </div>
          </div>

          <div className="task-item">
            <strong>What is already wired</strong>
            <div className="caption">
              Hardcoded Base verification tags, share-card metadata, Farcaster/Base manifest output,
              Coinbase Wallet + injected-only connectors, and post-confirmation transaction tracking.
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

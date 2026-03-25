export const CONTRACT_ADDRESS = '0x8f29714483F96B3877882FAD6D0A9b4af673F399';

export const baseFlowAbi = [
  {
    inputs: [],
    name: 'taskCount',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes32', name: '_content', type: 'bytes32' }],
    name: 'createTask',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes32[]', name: '_contents', type: 'bytes32[]' }],
    name: 'batchCreate',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: '_id', type: 'uint256' },
      { internalType: 'uint8', name: '_status', type: 'uint8' },
    ],
    name: 'updateStatus',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '_id', type: 'uint256' }],
    name: 'getTask',
    outputs: [
      { internalType: 'bytes32', name: '', type: 'bytes32' },
      { internalType: 'uint8', name: '', type: 'uint8' },
      { internalType: 'address', name: '', type: 'address' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '_user', type: 'address' }],
    name: 'getUserTasks',
    outputs: [{ internalType: 'uint256[]', name: '', type: 'uint256[]' }],
    stateMutability: 'view',
    type: 'function',
  },
];

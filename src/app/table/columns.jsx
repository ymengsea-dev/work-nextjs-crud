import { createColumnHelper } from '@tanstack/react-table';

const columnHelper = createColumnHelper();

export const columns = [
    columnHelper.accessor('id', {
        header: 'ID',
        cell: info => info.getValue(),
    }),
    columnHelper.accessor('name', {
        header: 'Product Name',
        cell: info => <span className="font-bold text-gray-800">{info.getValue()}</span>,
    }),
    columnHelper.accessor('status', {
        header: 'Status',
        cell: info => {
            const status = info.getValue();
            const color = status === 'ACTIVE' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50';
            return (
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${color}`}>
          {status}
        </span>
            );
        },
    }),
];
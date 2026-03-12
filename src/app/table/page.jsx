'use client';

import React from 'react';
import {
    useReactTable,
    getCoreRowModel,
    flexRender
} from '@tanstack/react-table';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { columns } from "@/app/table/columns";
import { getProductsPaginated } from '@/service/productService';

function page() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // state management
    const pageIndex = Number(searchParams.get("page")) || 0;
    const pageSize = Number(searchParams.get("size")) || 20;
    const status = searchParams.get("status") || '';
    const query = searchParams.get("query") || '';

    // data fetching
    const { data, isLoading, isPlaceholderData } = useQuery({
        queryKey: ['products', pageIndex, pageSize, status, query],
        queryFn: () => getProductsPaginated({ page: pageIndex, size: pageSize, status, query }),
        placeholderData: keepPreviousData,
    })

    // --- 3. URL SYNC HELPER ---
    const updateUrl = (updates) => {
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(updates).forEach(([key, value]) => {
            if (value) params.set(key, value);
            else params.delete(key);
        });
        if (!updates.page) params.set('page', '0');

        router.push(`${pathname}?${params.toString()}`);
    };

    // --- 4. TABLE CONFIGURATION ---
    const table = useReactTable({
        data: data?.items ?? [],
        columns,
        pageCount: data?.totalPages || (data?.totalItems ? Math.ceil(data.totalItems / pageSize) : 1),
        manualPagination: true,
        state: {
            pagination: { pageIndex, pageSize },
        },
        onPaginationChange: (updater) => {
            const nextState = updater({ pageIndex, pageSize });
            updateUrl({ page: nextState.pageIndex.toString() });
        },
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="p-6 max-w-6xl mx-auto">
            {/* FILTER BAR */}
            <div className="flex gap-4 mb-4">
                <input
                    placeholder="Search..."
                    className="border p-2 rounded w-64"
                    defaultValue={query}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            updateUrl({ query: e.currentTarget.value, page: '0' });
                        }
                    }}
                    onBlur={(e) => updateUrl({ query: e.target.value, page: '0' })}
                />
                <select
                    value={status}
                    onChange={(e) => updateUrl({ status: e.target.value })}
                    className="border p-2 rounded"
                >
                    <option value="">All Status</option>
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                </select>

                <select
                    value={pageSize}
                    onChange={(e) => updateUrl({ size: e.target.value, page: '0' })}
                    className="border p-2 rounded ml-auto"
                >
                    <option value="5">5 per page</option>
                    <option value="10">10 per page</option>
                    <option value="20">20 per page</option>
                    <option value="50">50 per page</option>
                </select>
            </div>

            {/* THE TABLE */}
            <div className={`overflow-hidden border rounded-lg ${isPlaceholderData ? 'opacity-50' : ''}`}>
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 uppercase text-xs text-gray-500">
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <th key={header.id} className="px-4 py-3 border-b">
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.map(row => (
                            <tr key={row.id} className="hover:bg-gray-50">
                                {row.getVisibleCells().map(cell => (
                                    <td key={cell.id} className="px-4 py-3 border-b">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* PAGINATION CONTROLS */}
            <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                    Page {pageIndex + 1} of {data?.totalPages || 1}
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage() || isLoading}
                        className="px-4 py-2 bg-white border rounded disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <button
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage() || isLoading}
                        className="px-4 py-2 bg-white border rounded disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}

export default page;
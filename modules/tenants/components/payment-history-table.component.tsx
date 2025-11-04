/**
 * Payment History Table Component
 */

"use client";

import { format } from "date-fns";
import { FileTextIcon, EyeIcon } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import type { SubscriptionPayment } from "@/shared/types";

interface PaymentHistoryTableProps {
  payments: SubscriptionPayment[];
}

export function PaymentHistoryTable({ payments }: PaymentHistoryTableProps) {
  const sortedPayments = [...payments].sort((a, b) => {
    const dateA = a.paidAt || a.createdAt || new Date(0);
    const dateB = b.paidAt || b.createdAt || new Date(0);
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-800">
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-400 uppercase tracking-wide">
              Date
            </th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-400 uppercase tracking-wide">
              Amount
            </th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-400 uppercase tracking-wide">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {sortedPayments.map((payment) => (
            <tr
              key={payment.id}
              className="hover:bg-gray-800/50 transition-colors"
            >
              {/* Date */}
              <td className="py-4 px-4">
                <p className="text-white">
                  {payment.paidAt
                    ? format(payment.paidAt, "yyyy-MM-dd")
                    : payment.createdAt
                    ? format(payment.createdAt, "yyyy-MM-dd")
                    : "N/A"}
                </p>
              </td>

              {/* Amount */}
              <td className="py-4 px-4">
                <p className="font-semibold text-white">
                  ${payment.amount.toFixed(2)}
                </p>
              </td>

              {/* Status */}
              <td className="py-4 px-4">
                {payment.hasPaid ? (
                  <Badge className="bg-green-500/10 text-green-400 border-green-500/30 hover:bg-green-500/20">
                    Paid
                  </Badge>
                ) : (
                  <Badge className="bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20">
                    Unpaid
                  </Badge>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

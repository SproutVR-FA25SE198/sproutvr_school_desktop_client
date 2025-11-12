"use client"

import { useState } from "react"
import { Button } from "@/common/components/ui/button"
import { Card } from "@/common/components/ui/card"
import { AccountCard } from "../components/account-card"
import ImportAccountsDialog from "../components/dialogs/import-accounts-dialog"
import { AccountStatus, type Account } from "../types/account.types"

const initialAccounts: Account[] = [
    
]

export default function AccountsPage() {
    const [filterStatus, setFilterStatus] = useState<string>("all")
    const [accounts, setAccounts] = useState<Account[]>(initialAccounts)
    const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)

    const filteredAccounts = filterStatus === "all" ? accounts : accounts.filter((a) => String(a.status) === filterStatus)

    const activeCount = accounts.filter((a) => a.status === AccountStatus.Active).length
    const disabledCount = accounts.filter((a) => a.status === AccountStatus.Disabled).length

    const handleImportAccounts = (newAccounts: any[]) => {
        
        setAccounts([...accounts, ...newAccounts])
        setIsImportDialogOpen(false)
    }

    return (
        <div className="flex h-screen bg-neutral-50">
            {/* <Sidebar /> */}

            <div className="flex-1 flex flex-col">
                {/* <TopBar schoolName="Lincoln High School" userName="John Doe" /> */}

                <div className="flex-1 overflow-y-auto px-8 pt-8 pb-24">
                    <div className="max-w-7xl mx-auto">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-3xl font-bold text-neutral-900 mb-2">Quản lý tài khoản giáo viên</h2>
                                <p className="text-neutral-500">Tìm kiếm và cập nhật tài khoản giáo viên trong hệ thống.</p>
                            </div>
                            <Button variant="default" size="lg" onClick={() => setIsImportDialogOpen(true)}>
                                + Thêm tài khoản mới
                            </Button>
                        </div>

                        {/* Status overview */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                            <Card className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-neutral-500 mb-1">Hoạt động</p>
                                        <p className="text-3xl font-bold text-neutral-900">{activeCount}</p>
                                    </div>
                                    <span className="text-4xl">🟢</span>
                                </div>
                            </Card>
                            <Card className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-neutral-500 mb-1">Đã khóa</p>
                                        <p className="text-3xl font-bold text-neutral-900">{disabledCount}</p>
                                    </div>
                                    <span className="text-4xl">🟠</span>
                                </div>
                            </Card>
                        </div>

                        {/* Filter buttons */}
                        <div className="flex gap-2 mb-6">
                            <Button
                                variant={filterStatus === "all" ? "default" : "outline"}
                                size="sm"
                                onClick={() => setFilterStatus("all")}
                            >
                                All
                            </Button>
                            <Button
                                variant={filterStatus === String(AccountStatus.Active) ? "default" : "outline"}
                                size="sm"
                                onClick={() => setFilterStatus(String(AccountStatus.Active))}
                            >
                                Hoạt động
                            </Button>
                            <Button
                                variant={filterStatus === String(AccountStatus.Disabled) ? "default" : "outline"}
                                size="sm"
                                onClick={() => setFilterStatus(String(AccountStatus.Disabled))}
                            >
                                Đã khóa
                            </Button>
                        </div>

                        {/* Accounts grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {filteredAccounts.map((account) => (
                                <AccountCard
                                    key={account.userId}
                                    {...account}
                                />
                            ))}
                        </div>

                        {filteredAccounts.length === 0 && (
                            <Card className="text-center py-12">
                                <p className="text-neutral-500">Không tìm thấy tài khoản nào theo bộ lọc.</p>
                            </Card>
                        )}
                    </div>
                </div>
            </div>

            {/* Import accounts dialog */}
            <ImportAccountsDialog
                isOpen={isImportDialogOpen}
                onClose={() => setIsImportDialogOpen(false)}
                onImport={handleImportAccounts}
            />

        </div>
    )
}

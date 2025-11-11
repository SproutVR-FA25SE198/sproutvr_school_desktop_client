"use client"

import { useState } from "react"
import { Button } from "@/common/components/ui/button"
import { Card } from "@/common/components/ui/card"
import { AccountCard } from "../components/account-card"
import ImportAccountsDialog from "../components/dialogs/import-accounts-dialog"
import type { AccountDisplay } from "../types/account.types"
import { AccountStatus } from "../types/account.types"
import EditAccountDialog from "../components/dialogs/edit-account-dialog"

const initialAccounts: AccountDisplay[] = [
    {
        id: "acc-1",
        firstName: "Nguyễn",
        lastName: "Văn An",
        username: "nguyen.van.an",
        email: "nguyen.van.an@sproutvrschool.com",
        status: AccountStatus.Active,
        createdAtUtc: "2025-11-10T10:30:00Z",
        updatedAtUtc: "2025-11-10T10:30:00Z",
    },
    {
        id: "acc-2",
        firstName: "Trần",
        lastName: "Thị Bích",
        username: "tran.thi.bich",
        email: "tran.thi.bich@sproutvrschool.com",
        status: AccountStatus.Active,
        createdAtUtc: "2025-11-10T10:30:00Z",
        updatedAtUtc: "2025-11-10T10:30:00Z",
    },
    {
        id: "acc-3",
        firstName: "Lê",
        lastName: "Hoàng Nam",
        username: "le.hoang.nam",
        email: "le.hoang.nam@sproutvrschool.com",
        status: AccountStatus.Active,
        createdAtUtc: "2025-11-10T10:30:00Z",
        updatedAtUtc: "2025-11-10T12:30:00Z",
    },
    {
        id: "acc-4",
        firstName: "Phạm",
        lastName: "Thị Hoa",
        username: "pham.thi.hoa",
        email: "pham.thi.hoa@sproutvrschool.com",
        status: AccountStatus.Active,
        createdAtUtc: "2025-11-10T10:30:00Z",
        updatedAtUtc: "2025-11-10T10:30:00Z",
    },
    {
        id: "acc-5",
        firstName: "Vũ",
        lastName: "Đức Minh",
        username: "vu.duc.minh",
        email: "vu.duc.minh@sproutvrschool.com",
        status: AccountStatus.Disabled,
        createdAtUtc: "2025-11-10T10:30:00Z",
        updatedAtUtc: "2025-11-10T10:30:00Z",
    },
    {
        id: "acc-6",
        firstName: "Bùi",
        lastName: "Quang Huy",
        username: "bui.quang.huy",
        email: "bui.quang.huy@sproutvrschool.com",
        status: AccountStatus.Active,
        createdAtUtc: "2025-11-10T10:30:00Z",
        updatedAtUtc: "2025-11-10T10:30:00Z",
    },
    {
        id: "acc-7",
        firstName: "Đỗ",
        lastName: "Thị Lan",
        username: "do.thi.lan",
        email: "do.thi.lan@sproutvrschool.com",
        status: AccountStatus.Active,
        createdAtUtc: "2025-11-10T10:30:00Z",
        updatedAtUtc: "2025-11-10T10:30:00Z",
    },
    {
        id: "acc-8",
        firstName: "Hoàng",
        lastName: "Văn Tú",
        username: "hoang.van.tu",
        email: "hoang.van.tu@sproutvrschool.com",
        status: AccountStatus.Active,
        createdAtUtc: "2025-11-10T10:30:00Z",
        updatedAtUtc: "2025-11-10T11:30:00Z",
    },
    {
        id: "acc-9",
        firstName: "Nguyễn",
        lastName: "Thị Hạnh",
        username: "nguyen.thi.hanh",
        email: "nguyen.thi.hanh@sproutvrschool.com",
        status: AccountStatus.Active,
        createdAtUtc: "2025-11-10T10:30:00Z",
        updatedAtUtc: "2025-11-10T10:30:00Z",
    },
    {
        id: "acc-10",
        firstName: "Trịnh",
        lastName: "Quốc Bảo",
        username: "trinh.quoc.bao",
        email: "trinh.quoc.bao@sproutvrschool.com",
        status: AccountStatus.Active,
        createdAtUtc: "2025-11-10T10:30:00Z",
        updatedAtUtc: "2025-11-10T10:30:00Z",
    },
]

export default function AccountsPage() {
    const [filterStatus, setFilterStatus] = useState<string>("all")
    const [accounts, setAccounts] = useState<AccountDisplay[]>(initialAccounts)
    const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [selectedAccount, setSelectedAccount] = useState<AccountDisplay | null>(null)

    const filteredAccounts = filterStatus === "all" ? accounts : accounts.filter((a) => String(a.status) === filterStatus)

    const activeCount = accounts.filter((a) => a.status === AccountStatus.Active).length
    const disabledCount = accounts.filter((a) => a.status === AccountStatus.Disabled).length

    const handleImportAccounts = (newAccounts: any[]) => {
        const formattedAccounts: AccountDisplay[] = newAccounts.map((account, index) => ({
            id: `${crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${index}`}`,
            firstName: account.firstName,
            lastName: account.lastName,
            username: account.username,
            email: account.email,
            status: account.status !== undefined ? account.status : AccountStatus.Active,
            createdAtUtc: new Date().toISOString(),
            updatedAtUtc: new Date().toISOString(),
        }))
        setAccounts([...accounts, ...formattedAccounts])
        setIsImportDialogOpen(false)
    }

    const handleEditAccount = (account: AccountDisplay) => {
            setSelectedAccount(account)
            setIsEditDialogOpen(true)
    }
    
    const handleSaveAccount = (updatedAccount: AccountDisplay) => {
        const accountWithTimestamp = {
            ...updatedAccount,
            updatedAtUtc: new Date().toISOString(),
        }
        setAccounts(accounts.map((a) => (a.id === accountWithTimestamp.id ? accountWithTimestamp : a)))
        setIsEditDialogOpen(false)
        setSelectedAccount(null)
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
                                <h2 className="text-3xl font-bold text-neutral-900 mb-2">Quản lý tài khoản người dùng</h2>
                                <p className="text-neutral-500">Tìm kiếm và cập nhật tài khoản người dùng trong hệ thống.</p>
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
                                    key={account.id}
                                    {...account}
                                    onEdit={() => handleEditAccount(account)}
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

            {/* Edit account dialog */}
            <EditAccountDialog
                isOpen={isEditDialogOpen}
                account={selectedAccount}
                onClose={() => {
                    setIsEditDialogOpen(false)
                    setSelectedAccount(null)
                }}
                onSave={handleSaveAccount}
            />
        </div>
    )
}

export interface Account {
    id: string 
    uuid: string
    firstName: string 
    lastName: string 
    username: string 
    email: string 
    status: "Active" | "Disabled"
    createdAtUtc: string 
    updatedAtUtc: string 
}

export const generateMockAccounts = (count: number): Account[] => {
    const statuses: Array<"Active" | "Disabled"> = ["Active", "Disabled"]
    const accounts: Account[] = []

    for (let i = 0; i < count; i++) {
        const now = new Date()
        const createdDate = new Date(now.getTime())

        accounts.push({
            id: `acc-${Date.now()}-${i}`,
            uuid: `${Math.random().toString(16).slice(2)}-${Math.random().toString(16).slice(2)}-${Math.random().toString(16).slice(2)}`,
            firstName: ``,
            lastName: ``,
            username: ``,
            email: ``,
            status: statuses[Math.floor(Math.random() * statuses.length)],
            createdAtUtc: createdDate.toISOString(),
            updatedAtUtc: now.toISOString(),
        })
    }

    return accounts
}

export const mockAccounts: Account[] = [
    {
        id: "acc-1",
        uuid: "a73f83f8-7f54-435b-9de1-771bd7451151",
        firstName: "Nguyễn",
        lastName: "Văn An",
        username: "nguyen.van.an",
        email: "nguyen.van.an@sproutvrschool.com",
        status: "Active",
        createdAtUtc: "2025-11-10T10:30:00Z",
        updatedAtUtc: "2025-11-10T10:30:00Z",
    },
    {
        id: "acc-2",
        uuid: "db486d39-5bc9-4331-b9d0-0860501c35d1",
        firstName: "Trần",
        lastName: "Thị Bích",
        username: "tran.thi.bich",
        email: "tran.thi.bich@sproutvrschool.com",
        status: "Active",
        createdAtUtc: "2025-11-10T10:30:00Z",
        updatedAtUtc: "2025-11-10T10:30:00Z",
    },
    {
        id: "acc-3",
        uuid: "16010bd1-9efd-4762-894e-732b35f02ae9",
        firstName: "Lê",
        lastName: "Hoàng Nam",
        username: "le.hoang.nam",
        email: "le.hoang.nam@sproutvrschool.com",
        status: "Disabled",
        createdAtUtc: "2025-11-10T10:30:00Z",
        updatedAtUtc: "2025-11-10T12:30:00Z",
    },
    {
        id: "acc-4",
        uuid: "4c8ca248-aefe-46fe-afd7-dab278dd5845",
        firstName: "Phạm",
        lastName: "Thị Hoa",
        username: "pham.thi.hoa",
        email: "pham.thi.hoa@sproutvrschool.com",
        status: "Active",
        createdAtUtc: "2025-11-10T10:30:00Z",
        updatedAtUtc: "2025-11-10T10:30:00Z",
    },
    {
        id: "acc-5",
        uuid: "0b33fd43-9f61-4c53-ae67-146913b222fa",
        firstName: "Vũ",
        lastName: "Đức Minh",
        username: "vu.duc.minh",
        email: "vu.duc.minh@sproutvrschool.com",
        status: "Active",
        createdAtUtc: "2025-11-10T10:30:00Z",
        updatedAtUtc: "2025-11-10T10:30:00Z",
    },
    {
        id: "acc-6",
        uuid: "764b0539-19b6-43fc-a8a6-a5e1397173fd",
        firstName: "Bùi",
        lastName: "Quang Huy",
        username: "bui.quang.huy",
        email: "bui.quang.huy@sproutvrschool.com",
        status: "Active",
        createdAtUtc: "2025-11-10T10:30:00Z",
        updatedAtUtc: "2025-11-10T10:30:00Z",
    },
    {
        id: "acc-7",
        uuid: "2e7a0426-4845-49ac-8876-86faaf3a028c",
        firstName: "Đỗ",
        lastName: "Thị Lan",
        username: "do.thi.lan",
        email: "do.thi.lan@sproutvrschool.com",
        status: "Active",
        createdAtUtc: "2025-11-10T10:30:00Z",
        updatedAtUtc: "2025-11-10T10:30:00Z",
    },
    {
        id: "acc-8",
        uuid: "50285c64-28e1-409f-a3bc-0bf982b43b3b",
        firstName: "Hoàng",
        lastName: "Văn Tú",
        username: "hoang.van.tu",
        email: "hoang.van.tu@sproutvrschool.com",
        status: "Disabled",
        createdAtUtc: "2025-11-10T10:30:00Z",
        updatedAtUtc: "2025-11-10T11:30:00Z",
    },
    {
        id: "acc-9",
        uuid: "bbeb873e-04bc-4f11-b01d-60efade450ae",
        firstName: "Nguyễn",
        lastName: "Thị Hạnh",
        username: "nguyen.thi.hanh",
        email: "nguyen.thi.hanh@sproutvrschool.com",
        status: "Active",
        createdAtUtc: "2025-11-10T10:30:00Z",
        updatedAtUtc: "2025-11-10T10:30:00Z",
    },
    {
        id: "acc-10",
        uuid: "57ea0708-91de-435d-ab9d-91035fae0096",
        firstName: "Trịnh",
        lastName: "Quốc Bảo",
        username: "trinh.quoc.bao",
        email: "trinh.quoc.bao@sproutvrschool.com",
        status: "Active",
        createdAtUtc: "2025-11-10T10:30:00Z",
        updatedAtUtc: "2025-11-10T10:30:00Z",
    },
]

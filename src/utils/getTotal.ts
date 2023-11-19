import { ITransaction } from "@/common/drafts/prisma";
import { TransactionType } from "@/common/enums/transaction-type";

const getTotalPeriodExpenseValue = (transactions: ITransaction[]): number => {
    let totalPeriodExpense: number = 0;
    transactions
        .filter((item) => {
            return item.type === TransactionType.EXPENSE
        })
        .forEach(item => {
            totalPeriodExpense += item.amount
        })

    return totalPeriodExpense;
}

const getTotalPeriodIncomeValue = (transactions: ITransaction[]): number => {
    let totalPeriodIncome: number = 0;
    transactions
        .filter((item) => {
            return item.type === TransactionType.INCOME
        })
        .forEach(item => {
            totalPeriodIncome += item.amount
        })

    return totalPeriodIncome;
}


export {
    getTotalPeriodIncomeValue,
    getTotalPeriodExpenseValue,
}
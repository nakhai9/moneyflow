import { TransactionType } from "@/common/enums/transaction";
import { IBase } from "@/common/interfaces/base";
import { ITransaction } from "@/common/interfaces/transaction";

const getTotalPeriodExpenseValue = (transactions: (ITransaction & IBase)[]): number => {
    let totalPeriodExpense: number = 0;
    transactions
        .filter((item: ITransaction & IBase) => {
            return item.type === TransactionType.EXPENSE
        })
        .forEach(item => {
            totalPeriodExpense += item.amount
        })

    return totalPeriodExpense;
}

const getTotalPeriodIncomeValue = (transactions: (ITransaction & IBase)[]): number => {
    let totalPeriodIncome: number = 0;
    transactions
        .filter((item: ITransaction & IBase ) => {
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
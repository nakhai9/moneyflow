import { IBase, ITransaction } from "@/common/drafts/prisma";

type TransactionModalProps = {
    transaction: ITransaction & IBase
}

const TransactionModal: React.FC<TransactionModalProps> = ({transaction}) => {
    return <>a</>
}

export default TransactionModal;
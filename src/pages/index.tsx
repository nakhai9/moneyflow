import { CURRENCIES } from "@/common/constants/currencies";
import { WalletType } from "@/common/enums/transaction-type";
import { IWallet } from "@/common/interfaces/wallet";
import DefaultLayout from "@/components/layouts/DefaultLayout";
import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from '@mui/icons-material/Add';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogProps, DialogTitle, MenuItem, Paper, Stack, TextField } from "@mui/material";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from 'yup';

const wallets: IWallet[] = [
  {
    id: 1,
    name: "Eximbank Account",
    amount: 3461920,
    currency: "VND",
    type: WalletType.CASH,
    userId: 1
  },
  {
    id: 2,
    name: "Loan Notebook",
    amount: 600000,
    currency: "VND",
    type: WalletType.LOAN,
    userId: 1
  }
]

type WalletSubmitForm = {
  name: string;
  type: WalletType,
  currencyId: string;
  amount: number;
  note?: string;
}

const validationSchema = yup.object().shape({
  name: yup.string().required("Wallet name is required"),
  type: yup.mixed<WalletType>().oneOf(Object.values(WalletType), 'Invalid wallet type').required('Type is required'),
  note: yup.string(),
  amount: yup.number().test('is-positive', 'Amount must be a positive number', (value) => { return value! > 0 }).required('Amount is required'),
  currencyId: yup.string().required()
})

const initialForm: WalletSubmitForm = {
  name: '',
  type: WalletType.LOAN,
  amount: 0,
  currencyId: '1',
}

const Home: NextPage = () => {

  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);
  const [maxWidth, setMaxWidth] = useState<DialogProps['maxWidth']>('xs');
  const { register, handleSubmit, watch, control, formState: { errors } } = useForm<WalletSubmitForm>({
    defaultValues: initialForm,
    resolver: yupResolver(validationSchema)
  })

  const openWallet = (id: number) => {
    router.push(`wallet/${id}`);
  }

  const close = () => {
    setOpen(!open);
  }

  const openModal = () => {
    setOpen(!open)
  }


  const onSubmit = async (data: WalletSubmitForm) => {
    console.log(data)
  };

  return (
    <>
      <Dialog open={open} fullWidth={true} maxWidth={maxWidth} onSubmit={handleSubmit(onSubmit)}>
        <form >
          <DialogTitle>Create wallet</DialogTitle>
          <DialogContent>
            <Controller control={control} name="name" rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  {...field}
                  size="small"
                  fullWidth
                  label="First Name"
                  margin="dense"
                  error={!!errors.name}
                  helperText={
                    errors.name && `${errors.name.message}`
                  } />
              )}
            />
            <Controller control={control} name="type" rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  size="small"
                  fullWidth
                  label="Type"
                  margin="dense"
                  error={!!errors.type}
                  helperText={
                    errors.type && `${errors.type.message}`
                  }>
                  {Object.values(WalletType).map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Controller control={control} name="amount" rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="number"
                    size="small"
                    fullWidth
                    label="Amount"
                    margin="dense"
                    error={!!errors.amount}
                    helperText={
                      errors.amount && `${errors.amount.message}`
                    } />
                )}
              />
              <Controller control={control} name="currencyId" rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    sx={{ minWidth: 100 }}
                    {...field}
                    select
                    size="small"
                    label="Currency"
                    margin="dense"
                    error={!!errors.currencyId}
                    helperText={
                      errors.currencyId && `${errors.currencyId.message}`
                    }>
                    {
                      CURRENCIES.map((type: any) => (
                        <MenuItem key={type.id} value={type.id}>
                          {type.iso4217code}
                        </MenuItem>
                      ))
                    }
                  </TextField>
                )}
              />
            </Box>
            <Controller control={control} name="note" rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  {...field}
                  size="small"
                  fullWidth
                  label="Note"
                  margin="dense"
                  error={!!errors.note}
                  helperText={
                    errors.note && `${errors.note.message}`
                  } />
              )}
            />
          </DialogContent>
          <DialogActions>
            <Button type="button" onClick={close} variant="contained" color="inherit">Cancel</Button>
            <Button type="submit" variant="contained" color="primary">Create</Button>
          </DialogActions>
        </form>
      </Dialog>
      <DefaultLayout>
        <div className="vdt-container vdt-mx-auto vdt-p-4 ">
          <h2 className="vdt-mb-2 vdt-text-xl vdt-font-semibold vdt-text-slate-500">Wallets</h2>
          <div className="vdt-grid vdt-grid-cols-5 vdt-gap-4">
            {
              wallets.length > 0 && wallets.map((item, index: number) => (<div key={index} onClick={() => { openWallet(item.id) }} className="vdt-flex vdt-h-28 vdt-shadow-lg vdt-bg-white vdt-rounded vdt-cursor-pointer vdt-font-thin vdt-overflow-hidden hover:vdt-shadow-lg">
                <div className="vdt-w-5 vdt-bg-blue-500"></div>
                <div className="vdt-flex vdt-flex-col vdt-justify-center vdt-pl-4">
                  <div className="vdt-text-xl">{item.name}</div>
                  <div className="vdt-capitalize">{item.type}</div>
                  <div className="vdt-text-xl vdt-text-blue-500 vdt-font-semibold">{item.amount.toLocaleString()} <span>{item.currency}</span></div>
                </div>
              </div>))
            }
            <div className="vdt-flex vdt-flex-col vdt-justify-start vdt-font-thin vdt-space-y-4">
              {
                /*
                  ======================================= THIS IS CODE OF VERSION USING TAILWIND ============================================== 
                  <button type="button" className="vdt-bg-white vdt-p-2 vdt-rounded vdt-text-sm vdt-font-semibold vdt-text-blue-500 vdt-shadow hover:vdt-shadow-lg" onClick={goto}>  <FontAwesomeIcon icon={faPlus} className="" /> Add New Wallet</button>
                  <button type="button" className="vdt-bg-white vdt-p-2 vdt-rounded vdt-text-sm vdt-font-semibold vdt-text-blue-500 vdt-shadow hover:vdt-shadow-lg">Connect a Bank Account</button>
                  ============================================================ END ============================================================
                */
              }
              <Button type="button" variant="contained" color="primary" sx={{ textTransform: "none" }} startIcon={<AddIcon />} onClick={openModal}>Add wallet</Button>
              <Button type="button" variant="outlined" sx={{ textTransform: "none" }}>Connect a Bank Account</Button>
            </div>
          </div>
          {
            /* ======================================= THIS IS CODE OF VERSION USING TAILWIND ============================================== 
              <h2 className="vdt-mb-2 vdt-mt-6 vdt-text-xl vdt-font-semibold vdt-text-slate-500">Overview</h2>
              <div className="vdt-grid vdt-grid-cols-3 vdt-gap-4">
                <div className="vdt-bg-white vdt-rounded vdt-p-4">
                  <h3 className="vdt-font-semibold vdt-text-slate-500">Total Balance</h3>
                  <div className="vdt-text-xl vdt-text-blue-500">0.00 <span>USD</span></div>
                </div>
                <div className="vdt-bg-white vdt-rounded vdt-p-4">
                  <h3 className="vdt-font-semibold vdt-text-slate-500">Total Period Income</h3>
                  <div className="vdt-text-xl vdt-text-blue-500">0.00 <span>USD</span></div>
                </div>
                <div className="vdt-bg-white vdt-rounded vdt-p-4">
                  <h3 className="vdt-font-semibold vdt-text-slate-500">Total Period Expenses</h3>
                  <div className="vdt-text-xl vdt-text-blue-500">0.00 <span>USD</span></div>
                </div>
              </div> 
              ============================================================ END ============================================================
            */
          }

        </div>
      </DefaultLayout>
    </>


  )
}
export default Home;
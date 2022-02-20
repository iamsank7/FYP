import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CachedIcon from '@mui/icons-material/Cached';
import { CardActions, CardContent, Fab, Paper, Modal, Box, TextField, MenuItem } from '@mui/material';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { getOwner, getUserData } from "../contracts/paymentV1"
import useWallet from "../../hooks/useWallet";

const style = {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 300,
    bgcolor: 'background.paper',
    textAlign: 'center',
    boxShadow: 24,
    p: 4,
  };

const Recharge = ({userId , userBalance}) => {

    const [open, setOpen] = useState(false);
    const [acceptedTokensList, setTokensList] = useState([]);
    const {
        account
    } = useWallet();
    const [selectedToken, setSelectedToken] = useState(null);
    const [rechargeValue, setRechargeValue] = useState(0);
    const [button, setButton] = useState('confirm');

    // useEffect(async () => {
    //     if(!!account) {

    //         let _acceptedTokens = await getAcceptedTokens();
    //         setTokensToken(_acceptedTokens);

    //     }
    // }, [account]);
    
    const handleButtonState = async (e) => {
        if(button === 'confirm'){
            let approvalAmount = await getTokenApproval(selectedToken);

            if(approvalAmount > rechargeValue){
                setButton('recharge');
            }
            else{
                setButton('approve');
            }
        }
        else if(button === 'recharge'){
            // recharg
            // recharge(selectedToken, rechargeValue)
            console.log('recharge');
        }
        else{
            console.log('approve');
            let transactionHash = await approveToken(selectedToken, rechargeValue);

            if(!!transactionHash){
                setButton('recharge');
            }
        }
    }

    return (
        <div>
            <Paper elevation={5}>
            <Card sx={{ minWidth: 275 }}>
                <CardContent>
                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                      Low Balance
                    </Typography>
                    
                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                      ID: {userId}
                    </Typography>

                    <Typography variant="h5" component="div">
                      ₹ {userBalance}
                    </Typography>
                    
                </CardContent>
                <CardActions>
                    <Button 
                        loading 
                        sx={{margin: 'auto'}} 
                        startIcon={<CachedIcon/>} 
                    >
                        Current Balance
                    </Button>
                </CardActions>
            </Card>
            </Paper>
            <br/>
            <Fab variant='extended' onClick={e => setOpen(true)}>
                Recharge Now
             </Fab>
             <Modal
                open={open}
                onClose={e => setOpen(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                >
                    <Box sx={style} component='form' >
                        <InputLabel id="demo-simple-select-filled-label">Choose Token</InputLabel>
                        <Select
                        labelId="demo-simple-select-filled-label"
                        id="demo-simple-select-filled"
                        value={selectedToken}
                        onChange={e => console.log(e.target.value)}
                        >
                            {acceptedTokensList.map(token => {
                                return (
                                    <MenuItem value={token.address}>{token.name} Balance: {token.balance}</MenuItem>
                                )
                            })}
                            
                        </Select>
                        <TextField
                            required
                            id="outlined-required"
                            label="Amount"
                            placeholder='Enter Amount'
                        />
                        <br/>
                        
                        <Fab variant='extended' sx={{width: 120, margin: 'auto', backgroundColor: 'blanchedalmond' }} onClick={handleButtonState}>
                            {button}
                        </Fab>

                    </Box>
                </Modal>
        </div>
    )
}

export default Recharge;
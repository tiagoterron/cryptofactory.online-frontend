import React, { useEffect, useState } from "react";

import { ethers, Contract, utils } from 'ethers';
import abi_usdmk from '../contracts/BUSDMaker.json';
import abi_busd from '../contracts/BEP20Token.json';


const ONLINE = true;
let BUSDMK_ADDRESS, BUSD_ADDRESS;
if(ONLINE){
BUSDMK_ADDRESS = "0x231007548a405FA6605C73145d89B89ef6b21d85";
BUSD_ADDRESS = "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56";
}else{
BUSDMK_ADDRESS = JSON.stringify(abi_usdmk.networks[5777].address).replace(/\"/g, "");
BUSD_ADDRESS = JSON.stringify(abi_busd.networks[5777].address).replace(/\"/g, "");
}
import $ from 'jquery';
export const TransactionContext = React.createContext();

const { ethereum } = window;
const ADMIN = "0xC4E39D51246B564202d60D13e4124182b2853D3e";

const ABI_CONTRACT = { //ganache
  addressBUSD: BUSD_ADDRESS,
  abiBUSD: abi_busd,
  addressBUSDMK: BUSDMK_ADDRESS,
  abiBUSDMK: abi_usdmk,
}

const CurrencyFormat = (amount) => {
  return parseFloat(amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
}
const CurrencyFormatDecimals = (amount, dec) => {
  return parseFloat(amount).toFixed(dec).replace(/\d(?=(\d{3})+\.)/g, '$&,')
}

const createEthereumContractBUSD = (network) => {
  
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  
  const Contract = new ethers.Contract(network.addressBUSD, network.abiBUSD.abi, signer);
  return Contract;
};
const createEthereumContractBUSDMK = (network) => {

  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const Contract = new ethers.Contract(network.addressBUSDMK, network.abiBUSDMK.abi, signer);
  return Contract;
};

function timeConverter(UNIX_timestamp, d){
  var a = new Date(UNIX_timestamp * 1000);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var day = weekday[a.getDay()];
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  if(d == true){
    var time = year+"-"+(a.getMonth()+1)+"-"+date+" "+hour+":"+min+":"+sec;
  }else{
    var time = day+" "+month+" "+date  + ', ' + year ;
  }
  
  return time;
}

function parseDate(str) {
  var mdy = str.split('/');
  return new Date(mdy[2], mdy[0]-1, mdy[1], "12", "30");
}

function datediff(first, second) {
  return Math.round((second-first)/(1000*60*60*24));
}


export const TransactionsProvider = ({ children }) => {

  const [USER, setUSER] = useState({getIfUserIsAirdrop:"", TOTAL_USERS_AIRDROP:"", getTotalAidropPaidUser:"", nStakings:"", getTotaReferralBonus:"", getUserReferrer:"",userAddress:"",getBalanceBUSD:"", getBalanceBUSD:"", getPeriod:"", getTokenSoldTodaybyUser:"", getUserUnclaimedTokens_T: "", TotalBalanceBUSD: "", TotalBalanceBUSDMK: "", getUserUnclaimedTokens_M: "", TotalUnclaimedBUSDMK_S: "", getUserBUSDStaked: "", getUserTokenStaked: ""});
  const [BUSD, setBUSD] = useState({BUSD_DAILYPROFIT:"", getUserTimeToNextAirdropRaw:"", RETURN_AIRDROP_CLAIM_LIMIT:"", getBUSDWeeklyAirdrop:"", TotalSupply: "", LimitSupply: "", totalBUSDStaked: ""});
  const [BUSDMK, setBUSDMK] = useState({TIME_TO_UNSTAKE_E:"", TIME_TO_UNSTAKE_M:"", TIME_TO_UNSTAKE_H:"", TOKEN_DAILYPROFIT_E:"", TOKEN_DAILYPROFIT_M:"",TOKEN_DAILYPROFIT_H:"", BUSDMK_SELL_LIMIT_DAILY_USER:"", BUSDMK_SELL_LIMIT:"", getTokenSoldToday: "", TokenPrice: "", TotalSupply: "", LimitSupply: "", TotalStaked: "", AvailableSupply: "", TotalUsers: "", totalTokenStaked: ""});
  const[CurrentAccount, setCurrentAccount] = useState("");
  const[STAKING, setStaking] = useState({id:"", addr: "", amount: "", period: "", startTime: ""});
  const[STAKE, setStake] = useState({id:"", addr: "", amount: "", period: "", startTime: ""});
  const [isLoading, setIsLoading] = useState(false);
  const handleChange = (e, name) => {
    setBUSD((prevState) => ({ ...prevState, [name]: e.target.value }));
  };
  const [show, setShow] = useState(false);
  const [MODAL, setModal] = useState({title:"", message:"", error:""});

  const handleClose = () =>  {
    setShow(false);
    window.location.reload();
    
  }
  const handleShow = (title, message, error) => {
    setShow(true);
    setModal((prevState) => ({ ...prevState, title: title, message: message, error: error }));
  }

  const stakeBUSD = async e => {
   try{
    e.preventDefault();
    const amount = $("#id_max_balance_busd_input").val();
    let referrer = $("#id_referrer_address").val();
    if (referrer.indexOf("0x") != 0){
    referrer = ADMIN;
    }
    const ContractBUSD = createEthereumContractBUSD(ABI_CONTRACT);
    const ContractBUSDMK = createEthereumContractBUSDMK(ABI_CONTRACT);
    setIsLoading(true);
    const ApproveBUSD = await ContractBUSD.approve(ABI_CONTRACT.addressBUSDMK, utils.parseEther(amount));
     
      /*handleShow("Approve this transaction",  "Please, approve this transaction to allow our protocol to transfer your BUSD into our pool", false);*/
      await ApproveBUSD.wait();
      if(ApproveBUSD.hash){
        setIsLoading(false);
      ContractBUSDMK.stakeBUSD(referrer, utils.parseEther(amount)).then(res2 => {
        setIsLoading(true);
        handleShow("Hash: "+res2.hash.slice(0, 25).toString()+"..", amount+" BUSD tokens were staked in the pool", false);
        ContractBUSDMK.getUserBUSDStaked(USER.userAddress).then(res => {
          res = utils.formatEther(res);
          setUSER(previousState => {return { ...previousState, getUserBUSDStaked: res }});
          getUserData(USER.userAddress);
          setIsLoading(false);
        });
      }, (error) => {
        setIsLoading(false);
        handleShow("Ops! Something went wrong!", error.data.message.toString(), true);
    });
    }

    }catch(error){
      handleShow(error.data.data.name.toString(), error.data.message.toString(), true);
    }
  };

  const stakeToken = async e => {

     e.preventDefault();
     
     let amount = $("#id_max_balance_busdmk_input").val();
     let period = $("input[name=time_lock]:checked").val();
     setIsLoading(true);
     const ContractBUSDMK = createEthereumContractBUSDMK(ABI_CONTRACT);
      ContractBUSDMK.stakeToken(utils.parseEther(amount), period).then(res => {
        setIsLoading(false);
        handleShow("Hash: "+res.hash.slice(0, 25).toString()+"..", amount+" CFY tokens were staked in the pool", false);
     }, (error) => {
      setIsLoading(false);
      handleShow("Ops! Something went wrong!", error.data.message.toString(), true);
    });

   };

   const unstakeToken = async (_id) => {

     const ContractBUSDMK = createEthereumContractBUSDMK(ABI_CONTRACT);
     setIsLoading(true);
     ContractBUSDMK.unStakeToken(_id).then(res => {
      setIsLoading(false);
      handleShow("Hash: "+res.hash.slice(0, 25).toString()+"..", "CFY tokens unstaked from the pool", false);
     }, (error) => {
      setIsLoading(false);
      handleShow("Ops! Something went wrong!", error.data.message.toString(), true);
    });
     

   };

   const sellToken = async e => {
     e.preventDefault();
     let amount = $("#id_max_balance_busdmk_input_sell").val();
     const ContractBUSDMK = createEthereumContractBUSDMK(ABI_CONTRACT);
     setIsLoading(true);
     ContractBUSDMK.sellToken(utils.parseEther(amount)).then((res, error) => {
        setIsLoading(false);
         handleShow("Hash: "+res.hash.slice(0, 25).toString()+"..", amount+ " CFY tokens were sold", false);
     }, (error) => {
      setIsLoading(false);
      handleShow("Ops! Something went wrong!", error.data.message.toString(), true);
  });
   
   };

  const claimToken_M = async () => {

     const ContractBUSDMK = createEthereumContractBUSDMK(ABI_CONTRACT);
     setIsLoading(true);
     ContractBUSDMK.claimToken_M().then(res => {
      setIsLoading(false);
      handleShow("Hash: "+res.hash.slice(0, 25).toString()+"..", "CFY tokens claimed from the pool. You can now stake them on the second pool", false);
     }, (error) => {
      setIsLoading(false);
      handleShow("Ops! Something went wrong!", error.data.message.toString(), true);
  });

   };

   const claimToken_T = async () => {
     const ContractBUSDMK = createEthereumContractBUSDMK(ABI_CONTRACT);
     setIsLoading(true);
     ContractBUSDMK.claimToken_T().then(res => {
      setIsLoading(false);
      handleShow("Hash: "+res.hash.slice(0, 25).toString()+"..", "CFY tokens claimed from the pool. You can now restake them into the pool", false);
     }, (error) => {
      setIsLoading(false);
      handleShow("Ops! Something went wrong!", error.data.message.toString(), true);
  });
   };

   const claimWeeklyAirDrop = async () => {
     const ContractBUSDMK = createEthereumContractBUSDMK(ABI_CONTRACT);
     setIsLoading(true);
     ContractBUSDMK.claimWeeklyAirDrop().then(res => {
      setIsLoading(false);
      handleShow("Hash: "+res.hash.slice(0, 25).toString()+"..", "Congratulations! You just earned free crypto! Check it in your wallet", false);
     }, (error) => {
      setIsLoading(false);
      handleShow("Ops! Something went wrong!", error.data.message.toString(), true);
  });
   };

   const changeValueContract = async e => {
    e.preventDefault();
    let value = $("#id_amount_new_value").val();
    const ContractBUSDMK = createEthereumContractBUSDMK(ABI_CONTRACT);
    const tx1 = await ContractBUSDMK.setNextSellSchedule(value);
    setIsLoading(true);
      await tx1.wait();
      if(tx1.hash){
        setIsLoading(false);
     } 

  };

  const checkIfWalletIsConnect = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask.");

      const accounts = await ethereum.request({ method: "eth_accounts" });
      if (accounts.length) {
        setCurrentAccount();
        getUserData(accounts[0]);
        setUSER(previousState => {return { ...previousState, userAddress: accounts[0] }});
      } else {
        handleShow("Connect a wallet", "Please, connect a wallet to start using our protocol", true);
      }
    } catch (error) {
      handleShow(error.data.data.name.toString(), error.data.message.toString(), true);
    }
  };

  const connectWallet = async () => {
    try {
      if (!ethereum) return handleShow("Install Metamask", "Ops! It looks like you do not have MetaMask installed in your computer. Try installing it before using our protocol", true);

      const accounts = await ethereum.request({ method: "eth_requestAccounts", });

      setCurrentAccount(accounts[0]);
    } catch (error) {

      throw new Error("No ethereum object");
    }
  };


  const getUserData = async (x) => {
    const CurrentUser = x;
    const ContractBUSD = createEthereumContractBUSD(ABI_CONTRACT);
    const ContractBUSDMK = createEthereumContractBUSDMK(ABI_CONTRACT);

    ContractBUSDMK.getTokenPrice().then(res => {
      res = utils.formatEther(res);
      setBUSDMK(previousState => {return { ...previousState, TokenPrice: res }});
    });

    ContractBUSDMK.balanceOf(CurrentUser).then(res => {
      res = utils.formatEther(res);
      setUSER(previousState => {return { ...previousState, getBalanceBUSDMK: res }});
    })

    ContractBUSDMK.getUserReferrer(CurrentUser).then(res => {
      res = res.toString();
      setUSER(previousState => {return { ...previousState, getUserReferrer: res }});
    });

    ContractBUSDMK.getTokenSoldToday().then(res => {
      res = utils.formatEther(res);
      setBUSDMK(previousState => {return { ...previousState, getTokenSoldToday: res }});
    });

    ContractBUSDMK.limitSupply().then(res => {
      res = utils.formatEther(res);
      setBUSDMK(previousState => {return { ...previousState, limitSupply: res }});
    });

    ContractBUSD.balanceOf(CurrentUser).then(res => {
      res = utils.formatEther(res);
      setUSER(previousState => {return { ...previousState, getBalanceBUSD: res }});
    });

    ContractBUSDMK.getUserUnclaimedTokens_T(CurrentUser).then(res => {
      res = utils.formatEther(res);
      setUSER(previousState => {return { ...previousState, getUserUnclaimedTokens_T: res }});
    });
    
    ContractBUSDMK.getUserUnclaimedTokens_M(CurrentUser).then(res => {
      res = utils.formatEther(res);
      setUSER(previousState => {return { ...previousState, getUserUnclaimedTokens_M: res }});
    });
    
    ContractBUSDMK.availableSupply().then(res => {
      res = utils.formatEther(res);
      setBUSDMK(previousState => {return { ...previousState, AvailableSupply: res }});
    });
    
    ContractBUSDMK.totalSupply().then(res => {
      res = utils.formatEther(res);
      setBUSDMK(previousState => {return { ...previousState, TotalSupply: res }});
    });
    
    ContractBUSDMK.totalUsers().then(res => {
      res = res.toString();
      setBUSDMK(previousState => {return { ...previousState, TotalUsers: res }});
    });
    
    ContractBUSDMK.getUserBUSDStaked(CurrentUser).then(res => {
      res = utils.formatEther(res);
      setUSER(previousState => {return { ...previousState, getUserBUSDStaked: res }});
    });
    
    ContractBUSDMK.getContractBUSDBalance().then(res => {
      res = utils.formatEther(res);
      setBUSD(previousState => {return { ...previousState, totalBUSDStaked: res }});
    });
    
    ContractBUSDMK.getUserTokenStaked(CurrentUser).then(res => {
      res = utils.formatEther(res);
      setUSER(previousState => {return { ...previousState, getUserTokenStaked: res }});
    });
    
    ContractBUSDMK.totalTokenStaked().then(res => {
      res = utils.formatEther(res);
      setBUSDMK(previousState => {return { ...previousState, totalTokenStaked: res }});
    });
    
    ContractBUSDMK.getTokenSoldTodaybyUser(CurrentUser).then(res => {
      res = utils.formatEther(res);
      setUSER(previousState => {return { ...previousState, getTokenSoldTodaybyUser: res }});
    });
    
    ContractBUSDMK.SELL_LIMIT().then(res => {
      res = utils.formatEther(res);
      setBUSDMK(previousState => {return { ...previousState, BUSDMK_SELL_LIMIT: res }});
    });
    

    ContractBUSDMK.SELL_LIMIT_DAILY_USER().then(res => {
      res = utils.formatEther(res);
      setBUSDMK(previousState => {return { ...previousState, BUSDMK_SELL_LIMIT_DAILY_USER: res }});
    });
    
    ContractBUSDMK.getBUSDWeeklyAirdrop().then(res => {
      res = utils.formatEther(res);
      setBUSD(previousState => {return { ...previousState, getBUSDWeeklyAirdrop: res }});
    });
    
    ContractBUSDMK.getUserTimeToNextAirdrop().then(res => {
      res = res.toString();
      var d = new Date(timeConverter(res, true));
      var df = (d.getMonth()+1)+"/"+d.getDate()+"/"+d.getFullYear()+" "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
      setBUSD(previousState => {return { ...previousState, getUserTimeToNextAirdrop: df }});
      setBUSD(previousState => {return { ...previousState, getUserTimeToNextAirdropRaw: res }});
    });

    ContractBUSDMK.RETURN_AIRDROP_CLAIM_LIMIT().then(res => {
      res = res.toString();
      setBUSD(previousState => {return { ...previousState, RETURN_AIRDROP_CLAIM_LIMIT: res }});
    });
    
    ContractBUSDMK.getTotaReferralBonus().then(res => {
      res = utils.formatEther(res.toString());
      setUSER(previousState => {return { ...previousState, getTotaReferralBonus: res }});
    });
    
    ContractBUSDMK.BUSD_DAILYPROFIT().then(res => {
      res = res.toString();
      setBUSD(previousState => {return { ...previousState, BUSD_DAILYPROFIT: res }});
    });

    ContractBUSDMK.getTotalAidropPaidUser().then(res => {
      res = utils.formatEther(res);
      setUSER(previousState => {return { ...previousState, getTotalAidropPaidUser: res }});
    });

    ContractBUSDMK.TOTAL_USERS_AIRDROP().then(res => {
      res = res.toString();
      setUSER(previousState => {return { ...previousState, TOTAL_USERS_AIRDROP: res }});
    });

    ContractBUSDMK.getIfUserIsAirdrop().then(res => {
      res = res.toString();
      setUSER(previousState => {return { ...previousState, getIfUserIsAirdrop: res }});
    });

    

    const TOKEN_DAILYPROFIT_E = await ContractBUSDMK.TOKEN_DAILYPROFIT_E();
    const TOKEN_DAILYPROFIT_E_R = TOKEN_DAILYPROFIT_E.toString();
    setBUSDMK(previousState => {return { ...previousState, TOKEN_DAILYPROFIT_E: TOKEN_DAILYPROFIT_E_R }});
    
    const TOKEN_DAILYPROFIT_M = await ContractBUSDMK.TOKEN_DAILYPROFIT_M();
    const TOKEN_DAILYPROFIT_M_R = TOKEN_DAILYPROFIT_M.toString();
    setBUSDMK(previousState => {return { ...previousState, TOKEN_DAILYPROFIT_M: TOKEN_DAILYPROFIT_M_R }});

    const TOKEN_DAILYPROFIT_H = await ContractBUSDMK.TOKEN_DAILYPROFIT_H();
    const TOKEN_DAILYPROFIT_H_R = TOKEN_DAILYPROFIT_H.toString();
    setBUSDMK(previousState => {return { ...previousState, TOKEN_DAILYPROFIT_H: TOKEN_DAILYPROFIT_H_R }});

    const TIME_TO_UNSTAKE_E = await ContractBUSDMK.TIME_TO_UNSTAKE_E();
    const TIME_TO_UNSTAKE_E_R = parseInt(TIME_TO_UNSTAKE_E.toString()/86400);
    setBUSDMK(previousState => {return { ...previousState, TIME_TO_UNSTAKE_E: TIME_TO_UNSTAKE_E_R }});


    const TIME_TO_UNSTAKE_M = await ContractBUSDMK.TIME_TO_UNSTAKE_M();
    const TIME_TO_UNSTAKE_M_R = parseInt(TIME_TO_UNSTAKE_M.toString()/86400);
    setBUSDMK(previousState => {return { ...previousState, TIME_TO_UNSTAKE_M: TIME_TO_UNSTAKE_M_R }});

    const TIME_TO_UNSTAKE_H = await ContractBUSDMK.TIME_TO_UNSTAKE_H();
    const TIME_TO_UNSTAKE_H_R = parseInt(TIME_TO_UNSTAKE_H.toString()/86400);
    setBUSDMK(previousState => {return { ...previousState, TIME_TO_UNSTAKE_H: TIME_TO_UNSTAKE_H_R }});

    

    var obj = {};
    for(let j = 0;j< 3; j++){
      if(j == 0){
        var daysLocked = TIME_TO_UNSTAKE_E_R;
        var dailyProfit = TOKEN_DAILYPROFIT_E_R;
      }else if(j == 1){
        var daysLocked = TIME_TO_UNSTAKE_M_R;
        var dailyProfit = TOKEN_DAILYPROFIT_M_R;
      }else if(j == 2){
        var daysLocked = TIME_TO_UNSTAKE_H_R;
        var dailyProfit = TOKEN_DAILYPROFIT_H_R;
      }
      const stake_amount = await ContractBUSDMK.getUserStaking(j, 0);
      const stake_amount_r = utils.formatEther(stake_amount);
      const stake_time_start = await ContractBUSDMK.getUserStaking(j, 1);
      const stake_time_start_r = stake_time_start.toString()
      const stake_rewards = await ContractBUSDMK.getStakeTokenReward(j, dailyProfit);
      const stake_rewards_r = utils.formatEther(stake_rewards);
      if(stake_time_start_r == 0) continue;
      var timeStart = timeConverter(stake_time_start_r, true);
      var createDateStart = new Date(timeStart);
      var formatDateStart = (createDateStart.getMonth()+1)+"/"+createDateStart.getDate()+"/"+createDateStart.getFullYear();
      var timeEnd = createDateStart.setDate(createDateStart.getDate() + daysLocked);
      var createTimeEnd = new Date(timeEnd)
      var formatTimeEnd = (createTimeEnd.getMonth()+1)+"/"+createTimeEnd.getDate()+"/"+createTimeEnd.getFullYear();
      var startDate = datediff(parseDate(formatDateStart), parseDate(formatTimeEnd));
      obj[j] = [];
      obj[j].id = j;
      obj[j].addr = USER.userAddress;
      obj[j].amount = stake_amount_r;
      obj[j].period = dailyProfit;
      obj[j].start = startDate;
      obj[j].rewards = stake_rewards_r;
      obj[j].totalDaysLocked = utils.formatEther (daysLocked-(startDate));
      obj[j].totalDays = daysLocked;

    }
    setStake(obj); 
   
  }

  useEffect(() => {
    checkIfWalletIsConnect();
    connectWallet();
   
  }, []);

  return (
    <TransactionContext.Provider
      value={{
        isLoading,
        BUSD,
        BUSDMK,
        USER,
        STAKING,
        stakeBUSD,
        stakeToken,
        sellToken,
        unstakeToken,
        CurrentAccount,
        getUserData,
        claimToken_M,
        claimToken_T,
        STAKE,
        CurrencyFormat,
        CurrencyFormatDecimals,
        changeValueContract,
        BUSDMK_ADDRESS,
        claimWeeklyAirDrop,
        handleShow,
        handleClose,
        show,
        MODAL,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};


 
  
  
  


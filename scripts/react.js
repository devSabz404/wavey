import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';
import abi from './utils/WavePortal.json';



const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [allWaves, setAllWaves] = useState([]);
  const [countWave,setWave]=useState();
  const [waveTx,setWaveTx]=useState();
  const[message,setMessage] =useState("");
  const contractAddress ="0xcD82E4D64DD6DF03148cb90bf789694d72b1e6b1";
  const contractABI =abi.abi;

  const handleMessage = (event)=>{
    event.preventDefault();
    setMessage(event.target.value);
  }
  /*
   * Create a method that gets all waves from your contract
   */
  const getAllWaves = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        /*
         * Call the getAllWaves method from your Smart Contract
         */
        const waves = await wavePortalContract.getAllWaves();
        

        /*
         * We only need address, timestamp, and message in our UI so let's
         * pick those out
         */
        let wavesCleaned = [];
        waves.forEach(wave => {
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message
          });
        });

        /*
         * Store our data in React State
         */
        setAllWaves(wavesCleaned);
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error);
    }
  }

  
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      const accounts = await ethereum.request({ method: 'eth_accounts' });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
  * Implement your connectWallet method here
  */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]); 
    } catch (error) {
      console.log(error)
    }
  }
const wave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());

        /*
        * Execute the actual wave from your smart contract
        */
        const waveTxn = await wavePortalContract.wave(message);
        console.log("Mining...", waveTxn.hash);
        setWaveTx(waveTxn);
       

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);
        setWaveTx();
        

        // count = await wavePortalContract.getTotalWaves();
        // console.log("Retrieved total wave count...", count.toNumber());
        //setWave(count.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }
  const loadWaver =async ()=>{

    try{
      const {ethereum} = window;

      if(ethereum){
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
        setWave(count.toNumber());


      }else{
        console.log("Ethereum object does not exist");
      }
    }catch(error){
      console.log(error);
    }

  }
  const wrapperFunction = ()=>{
    //handleMessage();
    wave();
    
  }

  
  


  useEffect(() => {
    checkIfWalletIsConnected(loadWaver(),getAllWaves());
  },[])
  
  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
        👋 Hey there!
        </div>

        <div className="bio">
          I am Sabali Connect your Ethereum wallet and wave at me!
        </div>
       <div class="wrapper">
        <input type="text"  value={message} onChange={handleMessage}/>
       </div> 
        <button className="btn" type="submit" onClick={wave} >
          Wave at Me
        </button>
       
       
        
        {/*
        * If there is no currentAccount render this button
        */}
        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}

        

        {waveTx ? (
        <div id="ball">
          <div id="ball1" class="balls"></div>
          <div id="ball2" class="balls"></div>
          <div id="ball3" class="balls"></div>
        </div>
        ):""}

        <h2>Number of waves : {countWave}</h2>

          {allWaves.map((wave, index) => {
          return (
            <div key={index} class="card" >
             <div class="bg"></div>
              <div class="content">
                 <h1 class="heading">{wave.address}</h1>
                 <p class="info">{wave.message}</p>
                 <h1 class="time"> {wave.timestamp.toString()}</h1>
              </div>
            </div>)
        })}
      </div>
    </div>
  );
}

export default App;
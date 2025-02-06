import React, { useEffect, useState } from 'react'

import '../App.css'
import '../styles/MainContainer.css'
import { useCreate } from '../hooks/index.ts'
import { useApp } from '../context/index.jsx'

import { ConnectButton, useCurrentWallet } from '@mysten/dapp-kit'
import 'react-datepicker/dist/react-datepicker.css'
import Checkbox from 'antd/es/checkbox/Checkbox'
import ClipLoader from 'react-spinners/ClipLoader'
import Input from '../components/Input.tsx'
import TextArea from '../components/TextArea.tsx'
import Footer from '../components/Footer.jsx'
import TopBar from '../components/TopBar.jsx'
import { format9 } from '../utils/format.ts'
import { suiToToken } from '../utils/firstBuy.ts'
import { PumpConfig } from '../config.jsx'
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import imageCompression from "browser-image-compression";
import { storage } from "../../firebase.config.js"; // Assicurati di importare Firebase


const CreateToken = () => {
  const { isConnected } = useCurrentWallet();
  const { state } = useApp()

  const { loading, createToken } = useCreate()

  const [tokenName, setTokenName] = useState('')
  const [tokenSymbol, setTokenSymbol] = useState('')
  const [tokenDescription, setTokenDescription] = useState('')
  const [tokenLogo, setTokenLogo] = useState('')
  const [website, setWebsite] = useState('https://')
  const [telegram, setTelegram] = useState('https://t.me')
  const [twitter, setTwitter] = useState('https://x.com')
  const [inputAmount, setInputAmount] = useState('0')
  const [isFirstBuy, setIsFirstBuy] = useState(false)
  const [uploading, setUploading] = useState(false);

  const handleCreate = () => {
    if (!tokenLogo) {
      alert("❌ You must upload a logo before creating the token.");
      return;
    }

    try {
      createToken(tokenName, tokenSymbol, tokenDescription, tokenLogo, website, telegram, twitter, inputAmount, suiToToken(inputAmount));
    } catch (e) {
      console.error(e);
    }
};

useEffect(() => {
  const savedLogo = localStorage.getItem("tokenLogo");
  if (savedLogo) {
      setTokenLogo(savedLogo);
  }
}, []);

  useEffect(() => {
    if (!isFirstBuy) {
      setInputAmount('0')
    }
  }, [isFirstBuy])

  const format9Suibalance = format9(state.suiBalance)
  
  
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);

    try {
        console.log("📂 File selected:", file.name, file.size, file.type);

        // 🔹 Controllo tipi di file ammessi
        const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
        if (!allowedTypes.includes(file.type)) {
            alert("❌ Unsupported file type. Only JPG, JPEG, PNG, and GIF files are allowed.");
            setUploading(false);
            return;
        }

        // 🔹 Controllo dimensioni e risoluzione
        const image = new Image();
        image.src = URL.createObjectURL(file);
        
        await new Promise<void>((resolve, reject) => {
            image.onload = () => {
                if (image.width > 5000 || image.height > 5000) {
                    alert("❌ Image dimensions exceed 5000x5000 pixels. Please upload a smaller image.");
                    setUploading(false);
                    reject();
                } else {
                    resolve();
                }
            };
            image.onerror = () => {
                alert("❌ Error loading the image. Please try again.");
                setUploading(false);
                reject();
            };
        });

        let finalFile = file;
        let fileName = `uploads/${file.name}`;

        if (file.type === "image/gif") {
            console.log("🎥 GIF detected: uploading without compression...");
            // Mantiene la GIF originale senza modificarla
        } else {
            console.log("📦 Compressing image to WebP...");
            const options = {
                maxSizeMB: 2,
                maxWidthOrHeight: 512,
                useWebWorker: true,
                fileType: "image/webp"
            };

            finalFile = await imageCompression(file, options);
            fileName = `uploads/${file.name.split('.')[0]}.webp`; // Cambia estensione in .webp
        }

        // 🔹 Upload to Firebase Storage
        const storageRef = ref(storage, fileName);
        await uploadBytes(storageRef, finalFile);

        // 🔹 Get public URL from Firebase
        const fileUrl = await getDownloadURL(storageRef);
        console.log("✅ File uploaded to Firebase:", fileUrl);

        // 🔹 Update state with the uploaded file URL
        setTokenLogo(fileUrl);

    } catch (error) {
        console.error("❌ Upload error:", error);
        alert("An error occurred during upload. Please try again.");
    } finally {
        setUploading(false);
    }
};
  return (
    <div>
      <div className="GlobalContainer launches-all-padding">
        <div style={{ zIndex: 1 }}>
          <TopBar />
          <div className="max-w-7xl m-auto px-4 md:px-12">
            <section className="lg:mx-auto w-full lg:w-[741px] min-w-0">
              <div className="my-4">
                <p className="ContractContentTextTitle h1">Create Token</p>
              </div>
              <div className="flex flex-col justify-center items-center gap-[10px] bg-[#1d1d1d] rounded-[25px] py-[45px] px-3 sm:px-[25px]">
                <section className="flex flex-col gap-4 w-full">
                  <div className="LpBalance">
                    <p className="Text1">
                      Name<span style={{ color: '#cd8f61' }}> *</span>
                    </p>
                  </div>
                  <section className="inputPanel">
                    <section className="inputPanelHeader w-full text-white">
                      <Input
                        placeholder="Enter Name"
                        label=""
                        type="text"
                        changeValue={setTokenName}
                        value={tokenName}
                      />
                    </section>
                  </section>
                </section>
                <section className="flex flex-col gap-4 w-full">
                  <div className="LpBalance">
                    <p className="Text1">
                      Symbol<span style={{ color: '#cd8f61' }}> *</span>
                    </p>
                  </div>
                  <section className="inputPanel">
                    <section className="inputPanelHeader w-full">
                      <Input
                        placeholder="Enter Symbol"
                        label=""
                        type="text"
                        changeValue={setTokenSymbol}
                        value={tokenSymbol}
                      />
                    </section>
                  </section>
                </section>
                <section className="w-full">
  <div className="LpBalance mb-2 text-left"> {/* Allinea a sinistra */}
    <p className="Text1">Logo<span style={{ color: '#cd8f61' }}> *</span></p>
  </div>
  <section className="inputPanel">
    <section className="inputPanelHeader w-full flex flex-col items-start gap-2"> {/* Cambiato `items-center` in `items-start` */}
      {!uploading && !tokenLogo && (
        <label className="bg-[#cd8e60] flex justify-center items-center h-6 text-white py-[2px] px-[12px] rounded-[6px] text-sm cursor-pointer mt-2" htmlFor="file-upload">
          Upload Image
        </label>
      )}
      <input id="file-upload" type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
      {uploading && <p className="text-sm text-gray-400">Uploading...</p>}
      {tokenLogo && <img src={tokenLogo} alt="Token Logo" className="mt-2 w-24 h-24 rounded-md" />}
    </section>
  </section>
</section>


                <section className="flex flex-col gap-4 w-full">
                  <p className="Text1 text-left">
                    Description (Max 1000 characters)
                    <span style={{ color: '#cd8f61' }}> *</span>
                  </p>
                  <section className="inputPanel" >
                    <section className="inputPanelHeader w-full text-white">
                      <TextArea
                        rows={6}
                        placeholder="Enter Token Description"
                        changeValue={setTokenDescription}
                        value={tokenDescription}


                      />
                    </section>
                  </section>
                </section>
                <section className="flex flex-col gap-4 w-full">
                  <div className="LpBalance">
                    <p className="Text1">Website</p>
                  </div>
                  <section className="inputPanel">
                    <section className="inputPanelHeader w-full">
                      <Input
                        placeholder="https://"
                        label=""
                        type="text"
                        changeValue={setWebsite}
                        value={website}
                      />
                    </section>
                  </section>
                </section>
                <section className="flex flex-col gap-4 w-full">
                  <div className="LpBalance">
                    <p className="Text1">Telegram</p>
                  </div>
                  <section className="inputPanel">
                    <section className="inputPanelHeader w-full">
                      <Input
                        placeholder="https://"
                        label=""
                        type="text"
                        changeValue={setTelegram}
                        value={telegram}
                      />
                    </section>
                  </section>
                </section>
                <section className="flex flex-col gap-4 w-full">
                  <div className="LpBalance">
                    <p className="Text1">X</p>
                  </div>
                  <section className="inputPanel">
                    <section className="inputPanelHeader w-full">
                      <Input
                        placeholder="https://"
                        label=""
                        type="text"
                        changeValue={setTwitter}
                        value={twitter}
                      />
                    </section>
                  </section>
                </section>
                <section className='flex items-center gap-2 self-start flex-row w-full'>
                  <Checkbox checked={isFirstBuy} onChange={(e) => setIsFirstBuy(e.target.checked)} />
                  <p className="Text1">Buy First</p>
                </section>
                {isFirstBuy &&
                  <section className="flex flex-col gap-4 w-full">
                    <div className="LpBalance">
                      <p className="Text1">Sui Amount</p>
                      <p className="Text1">Balance: {format9Suibalance}</p>
                    </div>
                    <section className="inputPanel">
                      <section className="inputPanelHeader w-full">
                        <Input
                          type="number"
                          placeholder="0"
                          value={inputAmount}
                          changeValue={setInputAmount}
                          label=''
                        />
                      </section>
                    </section>
                    <div className="w-full justify-end flex gap-1">
                      <p className="Text1">Estimate Token:</p>
                      <p className="Text1">{`${Number(suiToToken(inputAmount)) / 1000000} (${Math.floor(Number(BigInt(suiToToken(inputAmount))) / Number(PumpConfig.InitialVirtualTokenReserves) * 1000 * 100) / 1000}%)`}</p>
                    </div>
                  </section>
                }
                <div className="text-[#cd8f61] w-full w-max-[90%] m-0 text-[14px] flex justify-between">
                  <span>Deployment Fee:</span>
                  <span>0.99 SUI</span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    width: '100%'
                  }}
                >
                  {isConnected ? (
                    <button
                      disabled={!tokenName || !tokenSymbol || !tokenDescription || !tokenLogo || Number(inputAmount) + 0.2 > format9Suibalance || loading != 'False'}
                      onClick={handleCreate}
                      className="bg-[#cd8e60] flex justify-center items-center h-12 disabled:bg-[#434947] text-white py-[8px] px-[16px] rounded-[8px]"
                    >
                      {loading != 'False' ?
                        <ClipLoader
                          color={'#222'}
                          size={30}
                          aria-label="Loading Spinner"
                          data-testid="loader"
                        /> :
                        isFirstBuy ? 'Create and Buy' : 'Create'
                      }
                    </button  >
                  ) : (
                    <div className="justify-center flex">
                      <ConnectButton className='w-full h-12'
                        style={{
                          backgroundColor: '#cd8e60',
                          color: 'white',
                          padding: '8px 16px',
                          borderRadius: '8px',
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default CreateToken

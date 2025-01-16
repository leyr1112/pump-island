import React, { useRef, useState } from 'react'
import UploadIcon from '../icons/upload.svg'
import PropTypes from 'prop-types'
import Input from './Input.tsx'
import { Tooltip } from 'react-tooltip'
import LogoUploadBox from '../components/LogoUploadBox.jsx'
import BannerUploadBox from '../components/BannerUploadBox.jsx'
import { useAccount } from 'wagmi'
import {
  readContract,
  writeContract,
  getChainId,
  switchChain,
  waitForTransactionReceipt
} from '@wagmi/core'
import { getFactoryAddress } from '../utils/addressHelpers.ts'
import ChadPumpAbi from '../config/ChadPumpAbi.json'
import { imageUploadUrl, web3Clients } from '../utils/constants.ts'
import { config } from '../config.jsx'
import toast from 'react-hot-toast'
import ClipLoader from 'react-spinners/ClipLoader'

const UpdateBox = ({ data, onCreate }) => {
  const chainId = data?.chainId
  const description = data?.description
  const poolAddress = data?.poolAddress
  const { address, isConnected } = useAccount()
  const [isExpanded, setIsExpanded] = useState(false)
  // const [tokenDescription, setTokenDescription] = useState('')
  const [website, setWebsite] = useState(`${data?.website}`)
  const [telegram, setTelegram] = useState(`${data?.telegram}`)
  const [twitter, setTwitter] = useState(`${data?.twitter}`)
  const [discord, setDiscord] = useState(`${data?.discord}`)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const logoFileInput = useRef<HTMLInputElement>(null)
  const bannerFileInput = useRef<HTMLInputElement>(null)
  const [bannerPreview, setBannerPreview] = useState<string | null>(null)
  const [bannerFile, setBannerFile] = useState<File | null>(null)
  let [creating, setCreating] = useState(false)
  const toggleExpand = () => setIsExpanded(!isExpanded)

  const LogoImageUpload = ({ onChange, className, style }) => {
    const handleLogoImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files![0]
      setLogoFile(selectedFile)
      setLogoPreview(URL.createObjectURL(selectedFile))
      onChange(selectedFile)
    }
    const onButtonClick = () => {
      if (logoFileInput.current) {
        logoFileInput.current.click()
      }
    }
    return (
      <div style={{ width: '100%', position: 'relative' }}>
        <input
          type="file"
          ref={logoFileInput}
          accept="image/*"
          onChange={handleLogoImageChange}
          style={{ display: 'none' }}
        />
        <LogoUploadBox
          imageUrl={logoPreview}
          handleClick={onButtonClick}
          className={className}
          style={style}
        />
      </div>
    )
  }
  const BannerImageUpload = ({ onChange, className, style }) => {
    const handleBannerImageChange = (
      e: React.ChangeEvent<HTMLInputElement>
    ) => {
      const selectedFile = e.target.files![0]
      setBannerFile(selectedFile)
      setBannerPreview(URL.createObjectURL(selectedFile))
      onChange(selectedFile)
    }
    const onButtonClick = () => {
      if (bannerFileInput.current) {
        bannerFileInput.current.click()
      }
    }
    return (
      <div style={{ width: '100%', position: 'relative' }}>
        <input
          type="file"
          ref={bannerFileInput}
          accept="image/*"
          onChange={handleBannerImageChange}
          style={{ display: 'none' }}
        />
        <BannerUploadBox
          imageUrl={bannerPreview}
          handleClick={onButtonClick}
          className={className}
          style={style}
        />
      </div>
    )
  }

  const [, setImageLogoFile] = useState(null)
  const handleImageLogoChange = file => {
    setImageLogoFile(file)
  }

  const [, setImageBannerFile] = useState(null)
  const handleImageBannerChange = file => {
    setImageBannerFile(file)
  }

  const onBlackPumpUpdate = async () => {
    try {
      setCreating(true)

      if (chainId) {
        let updatePool: any
        console.log('debug info', website, twitter, telegram, discord)
        updatePool = await writeContract(config, {
          address: poolAddress,
          abi: ChadPumpAbi,
          functionName: 'updateSocials',
          args: [description, website, twitter, telegram, discord]
        })
        const receipt = await waitForTransactionReceipt(config, {
          hash: updatePool
        })

        let logoUrl: any
        let bannerUrl: any

        if (logoFile) {
          const formData = new FormData()
          formData.append('file', logoFile, poolAddress)
          fetch(imageUploadUrl + 'api/logoUploads', {
            method: 'POST',
            body: formData
          })
            .then(async res => {
              const logoResponse = await res.json()
              logoUrl = logoResponse.fileInfo.filename
              toast.success(`Successfully updated logo`)
              const link = `/buy/?chain=${chainId}&address=${poolAddress}`
              window.location.href = link
            })
            .catch(error => {
              setCreating(false)
              console.error('Error uploading logo:', error)
            })
        } else if (bannerFile) {
          const formData = new FormData()
          formData.append('file', bannerFile, poolAddress)
          fetch(imageUploadUrl + 'api/bannerUploads', {
            method: 'POST',
            body: formData
          })
            .then(async res => {
              const bannerResponse = await res.json()
              bannerUrl = bannerResponse.fileInfo.filename
              toast.success(`Successfully updated banner`)
              const link = `/buy/?chain=${chainId}&address=${poolAddress}`
              window.location.href = link
            })
            .catch(error => {
              setCreating(false)
              console.error('Error uploading banner:', error)
            })
        } else {
          console.log('No files to update')
          toast.success('refreshing the page...')
          const link = `/buy/?chain=${chainId}&address=${poolAddress}`
          window.location.href = link
        }
        setCreating(false)
      }
    } catch (err) {
      setCreating(false)
      console.error(err)
      toast.error(
        'There is a problem with your Black Pump create. Please try again later'
      )
    }
  }

  return (
    <div className="rounded-md shadow-md justify-items-center">
      {}
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={toggleExpand}
      >
        {/* <h3 className="text-lg font-semibold">title</h3> */}
        <button className="text-white border rounded-md p-1 mb-2 bg-[#000] mt-6 px-8">
          {isExpanded ? 'Collapse' : 'Expand'}
        </button>
      </div>

      {isExpanded && (
        <div className="p-2 rounded-md shadow-md">
          <section className="flex flex-col gap-4 w-[100%]">
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
          <section className="flex flex-col gap-4 w-[100%]">
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
          <section className="flex flex-col gap-4 w-[100%]">
            <div className="LpBalance">
              <p className="Text1">Twitter</p>
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
          <section className="flex flex-col gap-4 w-[100%]">
            <div className="LpBalance">
              <p className="Text1">Discord</p>
            </div>
            <section className="inputPanel">
              <section className="inputPanelHeader w-full">
                <Input
                  placeholder="https://"
                  label=""
                  type="text"
                  changeValue={setDiscord}
                  value={discord}
                />
              </section>
            </section>
          </section>
          <section className="flex flex-col sm:flex-row w-[100%]">
            <section className="flex flex-col gap-4">
              <div className="LpBalance">
                <p className="Text1 flex">
                  Upload Logo
                  {/* <span className="flex" style={{ color: 'red' }}>
                    *
                  </span> */}
                  <a className="flex pl-12" id="my-anchor-element">
                    <Tooltip
                      anchorSelect="#my-anchor-element"
                      className="w-64 md:w-80 lg:w-96 max-w-sm"
                      content="Please upload only images in .png, .jpg. The ideal size for uploads is 256x256 pixels for optimal quality and fit."
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                      className="h-5 w-5 cursor-pointer text-blue-gray-500"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                      />
                    </svg>
                  </a>
                </p>
              </div>
              <section className="inputPanel">
                <section className="w-full">
                  <LogoImageUpload
                    onChange={handleImageLogoChange}
                    className="h-[105px]"
                    style={undefined}
                  />
                </section>
              </section>
            </section>

            <section className="flex flex-col gap-4">
              <div className="LpBalance">
                <p className="Text1 flex">
                  Upload Banner
                  <span className="flex" style={{ color: 'red' }}>
                    <a
                      className="flex pl-8 text-[#d3d3d3]"
                      id="banner-anchor-element"
                    >
                      <Tooltip
                        anchorSelect="#banner-anchor-element"
                        className="w-64 md:w-80 lg:w-96 max-w-sm"
                        content="Please upload only images in .png, .jpg. The ideal size for uploads is 1200x600 pixels for optimal quality and fit."
                      />
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                        className="h-5 w-5 cursor-pointer text-blue-gray-500"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                        />
                      </svg>
                    </a>
                  </span>
                </p>
              </div>
              <section className="inputPanel">
                <section className="w-full pl-1">
                  <BannerImageUpload
                    onChange={handleImageBannerChange}
                    className="h-[105px]"
                    style={undefined}
                  />
                </section>
              </section>
            </section>
          </section>
          <div className="pt-4 rounded-md shadow-md justify-items-center">
            <div
              className="text-[16px] focus:outline-none h-[48px] flex justify-center items-center select-none font-bold text-center w-full bg-[#f0f0f0] hover:opacity-90 disabled:bg-[#646464] disabled:text-[#bbb] rounded-[24px] text-[#222]"
              onClick={onBlackPumpUpdate}
            >
              {creating === false ? (
                'Update'
              ) : (
                <ClipLoader
                  color={'#222'}
                  loading={creating}
                  size={30}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

UpdateBox.propTypes = {
  imageUrl: PropTypes.string,
  handleClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  style: PropTypes.object
}

UpdateBox.defaultProps = {
  imageUrl: undefined,
  className: '',
  style: {}
}

export default UpdateBox

import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Input from './Input.tsx'
import toast from 'react-hot-toast'
import ClipLoader from 'react-spinners/ClipLoader'

const UpdateBox = ({ data }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [website, setWebsite] = useState(`${data?.website}`)
  const [telegram, setTelegram] = useState(`${data?.telegram}`)
  const [twitter, setTwitter] = useState(`${data?.twitter}`)
  const [logoUrl, setLogoUrl] = useState(`${data.logoUrl}`)
  let [creating, setCreating] = useState(false)
  const toggleExpand = () => setIsExpanded(!isExpanded)

  const onBlackPumpUpdate = async () => {
    try {
      setCreating(true)
      console.log('create')
    } catch (err) {
      console.error(err)
      toast.error('There is a problem with your Black Pump create. Please try again later')
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="rounded-md shadow-md justify-items-center">
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={toggleExpand}
      >
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
              <p className="Text1">Logo</p>
            </div>
            <section className="inputPanel">
              <section className="inputPanelHeader w-full">
                <Input
                  placeholder="https://"
                  label=""
                  type="text"
                  changeValue={setLogoUrl}
                  value={logoUrl}
                />
              </section>
            </section>
          </section>
          <div className="pt-4 rounded-md shadow-md justify-items-center">
            <div
              className="text-[16px] focus:outline-none h-[48px] flex justify-center items-center select-none font-bold text-center w-full bg-[#cd8e60] hover:opacity-90 disabled:bg-[#646464] disabled:text-[#bbb] rounded-[8px] text-[#FFFF]"
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

export default UpdateBox

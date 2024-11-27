import Image from 'next/image'
import React from 'react'

export default function DarkPreview({ previewURL }: { previewURL: string }) {
  return (
    <div className="flex items-center space-x-2 bg-darkblue-500 rounded-[15px] relative">
                <div className=" p-[15px] pt-[20px] w-full">
                  {/* Name */}
                  <div className="relative flex place-content-center">
                    <div className="text-14 text-white font-medium text-center mb-4 truncate w-auto inline">
                      TEST
                    </div>
                    <span className="text-14 text-white font-medium ml-[5px] positive">
                      0.5
                    </span>
                    <span className="text-14 text-white font-medium ml-[5px] negative">
                      -0.5
                    </span>
                  </div>

                  {/* Image */}
                  <div className="h-100 w-100 mx-auto mb-4">
                    <Image
                      src={previewURL}
                      width={100}
                      height={100}
                      alt="Light Preview"
                    />
                  </div>

                  {/* ROI */}
                  <div className="flex place-content-between items-end">
                    <div>
                      <div className="text-14 text-slate-400 mb-1 font-regular">
                        ROI
                      </div>
                      <div className="text-20 text-white font-medium">1.18</div>
                    </div>
                  </div>
                </div>
              </div>
  )
}

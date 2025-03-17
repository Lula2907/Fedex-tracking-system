import React, { useState } from "react";
import Swal from "sweetalert2";
import "../App.css";

const Fedex = () => {
  const baseUrl = "https://fedex-7tk0.onrender.com";
  const [trackingNumber, setTrackingNumber] = useState("");
  const [trackingDetails, setTrackingDetails] = useState(null);
  const [carrierCode, setCarrierCode] = useState("");
  const [load, setLoad] = useState(false);

  const trackInfo = async () => {
    if (!carrierCode) {
      Swal.fire({
        title: "Select carrierCode",
        icon: "error",
      });
    } else if (!trackingNumber) {
      Swal.fire({
        title: "Enter your tracking number",
        icon: "error",
      });
    } else {
      setLoad(true);
      const trackingData = {
        trackingInfo: [
          {
            trackingNumberInfo: {
              trackingNumber: trackingNumber,
              carrierCode: carrierCode,
            },
          },
        ],
      };
      try {
        const request = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(trackingData),
        };

        const response = await fetch(`${baseUrl}/track`, request);
        const data = await response.json();
        setTrackingDetails(data);
        setLoad(false);

        if (response.ok) {
          Swal.fire({
            title: "Success!",
            text: "Tracking information retrieved successfully",
            icon: "success",
          });
        } else {
          Swal.fire({
            title: "Failed to track",
            icon: "error",
          });
        }
      } catch (error) {
        console.error("Error in tracking", error);
      } finally {
        setTrackingNumber("");
        setCarrierCode("");
      }
    }
  };

  const renderDetails = (data, level = 0) => {
    if (typeof data !== "object" || data === null) {
      return <span>{data}</span>;
    }

    return (
      <div className="w-full">
        {Object.entries(data).map(([key, value]) => (
          <div
            className="flex w-full sm:flex-row flex-col rounded items-center justify-center sm:text-left text-center"
            key={key}
          >
            <strong className="uppercase">{key}:</strong>
            {typeof value === "object" ? (
              renderDetails(value, level + 1)
            ) : (
              <span> {value}</span>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <div className="absolute top-[50px] sm:[600px] w-full bg-white h-full flex flex-col items-center">
        <div className="bg-pink-500 w-[300px] rounded-2xl mb-[50px] content-center flex justify-center items-center">
          <h1 className="text-center text-4xl text-white uppercase pb-[30px]">
            Fedex tracking system
          </h1>
        </div>

        <div className="py-8 liniar sm:[600px] w-full px-4 mx-auto max-w-2xl lg:py-16 shadow-2xl rounded-xl gradient">
          <h2 className="mb-4 text-xl font-bold text-white">Track a Package</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              trackInfo();
            }}
          >
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
              <div>
                <label className="block mb-2 text-2xl font-medium text-white">
                  Tracking Number
                </label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5"
                  placeholder="Enter Tracking Number"
                />
              </div>
              <div>
                <label className="block mb-2 text-2xl font-medium text-white">
                  Carrier Code
                </label>
                <select
                  value={carrierCode}
                  onChange={(e) => {
                    setCarrierCode(e.target.value);
                  }}
                  className="bg-white rounded w-[200px] h-[40px]"
                  name="carrierCode"
                >
                  <option value="">SELECT A CARRIAR CODE</option>
                  <option value="FDXE">FDXE</option>
                </select>
              </div>

              <button
                type="submit"
                className="bg-lime-400 inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-white rounded-lg hover:bg-lime-500"
              >
                {load ? (
                  <div role="status">
                    <svg
                      aria-hidden="true"
                      className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-red-500"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                    <span className="sr-only">Loading...</span>
                  </div>
                ) : (
                  <p>Track</p>
                )}
              </button>
            </div>
          </form>
        </div>
        <h1 className="text-black text-3xl text-center pt-[80px] w-full">
          TRACKING DETAILS
        </h1>
      </div>

      <div className="w-full p-4 absolute sm:top-[150%] top-[120%] overflow-x-hidden">
        {trackingDetails ? (
          <div className="bg-gray-100 rounded-lg w-full overflow-hidden">
            {renderDetails(trackingDetails)}
          </div>
        ) : (
          <p className="text-center text-gray-500">
            No tracking details available
          </p>
        )}
      </div>
    </>
  );
};

export default Fedex;

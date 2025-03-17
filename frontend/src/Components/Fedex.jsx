import React, { useState } from "react";
import Swal from "sweetalert2";
import "../App.css";

const Fedex = () => {
  const baseUrl = "https://fedex-7tk0.onrender.com";
  const [trackingNumber, setTrackingNumber] = useState("");
  const [trackingDetails, setTrackingDetails] = useState(null);
  const [carrierCode, setCarrierCode] = useState("");

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
      <div className=" w-full relative gap-[50px]">
        {Object.entries(data).map(([key, value]) => (
          <div
            className="flex sm:flex-row flex-col rounded items-center justify-center "
            key={key}
          >
            <strong className="text-xl w-full uppercase">{key}:</strong>
            {typeof value === "object" ? (
              renderDetails(value, level + 1)
            ) : (
              <span className=""> {value}</span>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <div className="absolute top-[50px] sm:[600px] w-full bg-white  h-full">
        <h1 className="text-center text-5xl uppercase pb-[30px]">
          Fedex tracking system
        </h1>
        <div className="py-8 liniar sm:[600px] w-full px-4 mx-auto max-w-2xl lg:py-16 shadow-2xl rounded-xl gradient">
          <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
            Track a Package
          </h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              trackInfo();
            }}
          >
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
              <div>
                <label className="block mb-2 text-2xl font-medium text-gray-900">
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
                <label className="block mb-2 text-2xl font-medium text-gray-900">
                  Carrier Code
                </label>
                <select
                  value={carrierCode}
                  onChange={(e) => {
                    setCarrierCode(e.target.value);
                  }}
                  className="bg-white rounded w-[200px] h-[40px]"
                  name="carrierCode"
                  id=""
                >
                  <option selected>SELECT A CARRIAR CODE</option>
                  <option value="FDXE">FDXE</option>
                </select>
              </div>

              <button
                type="submit"
                className="bg-lime-400 inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-white rounded-lg hover:bg-lime-500"
              >
                Track
              </button>
            </div>
          </form>
        </div>

        <h1 className="text-black text-3xl text-center pt-[80px]">
          TRACKING DETAILS
        </h1>
        <div className="p-4">
          {trackingDetails ? (
            <div className="bg-gray-100 p-4 rounded-lg ">
              {renderDetails(trackingDetails)}
            </div>
          ) : (
            <p className="text-center text-gray-500">
              No tracking details available
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default Fedex;

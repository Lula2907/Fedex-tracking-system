import React, { useState } from "react";
import Swal from "sweetalert2";
import "../App.css";

const Fedex = () => {
  const baseUrl = "https://fedex-7tk0.onrender.com";
  const [trackingNumber, setTrackingNumber] = useState("");
  const [trackingDetails, setTrackingDetails] = useState([]);
  const [carrierCode, setCarrierCode] = useState("");
  const [load, setLoad] = useState(false);

  const trackInfo = async () => {
    if (!carrierCode) {
      Swal.fire({ title: "Select carrierCode", icon: "error" });
    } else if (!trackingNumber) {
      Swal.fire({ title: "Enter your tracking number", icon: "error" });
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
        setLoad(false);

        if (response.ok) {
          Swal.fire({ title: "Success!", text: "Tracking information retrieved successfully", icon: "success" });
          setTrackingDetails(data.output.completeTrackResults[0].trackResults[0]);
        } else {
          Swal.fire({ title: "Failed to track", icon: "error" });
        }
      } catch (error) {
        console.error("Error in tracking", error);
      } finally {
        setTrackingNumber("");
        setCarrierCode("");
      }
    }
  };

  return (
    <>
      <div className="absolute top-[50px] w-full bg-white h-full flex flex-col items-center">
        <div className="bg-pink-500 w-[300px] rounded-2xl mb-[50px] flex justify-center items-center">
          <h1 className="text-center text-4xl text-white uppercase pb-[30px]">Fedex Tracking System</h1>
        </div>
        
        <div className="py-8 w-full px-4 mx-auto max-w-2xl lg:py-16 shadow-2xl rounded-xl linear">
          <h2 className="mb-4 text-xl font-bold text-white">Track a Package</h2>
          <form onSubmit={(e) => { e.preventDefault(); trackInfo(); }}>
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 ">
              <div>
                <label className="block mb-2 text-2xl font-medium text-white">Tracking Number</label>
                <input type="text" value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5" placeholder="Enter Tracking Number" />
              </div>
              <div>
                <label className="block mb-2 text-2xl font-medium text-white">Carrier Code</label>
                <select value={carrierCode} onChange={(e) => setCarrierCode(e.target.value)} className="bg-white rounded w-[200px] h-[40px]">
                  <option value="">SELECT A CARRIER CODE</option>
                  <option value="FDXE">FDXE</option>
                </select>
              </div>

              <button type="submit" className="bg-lime-400 inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-white rounded-lg hover:bg-lime-500">
                {load ? (
                  <span>Loading...</span>
                ) : (
                  <p>Track</p>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="w-full p-4 absolute sm:top-[150%] top-[120%] overflow-x-hidden">
        <h1 className="text-5xl text-center pb-[10px] font-bold text-purple-600 underline">Travel History</h1>
        <div className="timeline">
          {trackingDetails.dateAndTimes?.map((data, index) => (
            <div key={index} className="timeline-item">
              <div className="timeline-content">
                <h2 className="font-semibold text-lg">
                  {new Date(data.dateTime).toLocaleString("en-US", {
                    weekday: "long", year: "2-digit", month: "numeric", day: "numeric"
                  })}
                </h2>
                <p className="text-gray-600">{data.type}</p>
                <span className="text-gray-500">{data.location || "Unknown Location"}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Fedex;
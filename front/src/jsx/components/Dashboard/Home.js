import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "swiper/css";
import { ThemeContext } from "../../../context/ThemeContext";
import { useTranslation } from "react-i18next";
import coin from "./../../../images/coin.png";
import Loader from "../Loader/Loader";
import SwiperSlider from "../Swipers/SwiperSlider";

const Home = () => {
  const [bxgavailable, setbxgavailable] = useState(null);
  const [bxgstacked, setbxgstacked] = useState(null);
  const [totalEarning, settotalEarning] = useState(null);
  const [referralBonus, setreferralBonus] = useState(null);
  const [stakingreferralBonus, setStakingReferralBonus] = useState(null);
  const [rewardBonus, setRewardBonus] = useState(null);
  const [loader, setLoader] = useState(false);

  const { t } = useTranslation();
  const { changeBackground } = useContext(ThemeContext);

  useEffect(() => {
    changeBackground({ value: "dark", label: "Dark" });
    // Simulate fetching data here
    setLoader(true);
    setTimeout(() => {
      // Set your default or simulated data here
      setbxgavailable(0.01); // Example data
      setbxgstacked(50); // Example data
      settotalEarning(1500); // Example data
      setreferralBonus(200); // Example data
      setStakingReferralBonus(300); // Example data
      setRewardBonus(0); // Example data
      setLoader(false);
    }, 1000);
  }, []);

  return (
    <>
      {loader ? (
        <Loader />
      ) : (
        <div className="row">
          <div className="col-xl-12">
          
            <SwiperSlider
              bxgavailable={bxgavailable}
              bxgstacked={bxgstacked}
              totalEarning={totalEarning}
            />
          
          </div>
        </div>
      )}
    </>
  );
};

export default Home;

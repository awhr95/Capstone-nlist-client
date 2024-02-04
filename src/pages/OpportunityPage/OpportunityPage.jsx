import "./OpportunityPage.scss";
import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import backArrow from "../../assets/icons/backarrow.svg";

function timeFormatter(timeString) {
  let startTime = new Date(`2024-01-01T${timeString}`);
  let formattedTime = startTime.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  return formattedTime;
}
const apiUrl = process.env.REACT_APP_URL;
const port = process.env.REACT_APP_PORT;
const userId = sessionStorage.getItem("user_id");

const OpportunityPage = () => {
  const [opportunity, setOpportunity] = useState(null);
  const [user, setUser] = useState(null);
  const [userLogin, setUserLogin] = useState(false);
  const { opportunityId } = useParams();

  const fetchOpportunity = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}:${port}/opportunities/${opportunityId}`
      );
      setOpportunity(response.data);
    } catch (error) {
      console.error(error.message);
    }
  };

  const fetchUser = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}:${port}/users/saved/${userId}`
      );
      setUser(response.data);
    } catch (error) {
      console.error(error.message);
    }
  };
  useEffect(() => {
    fetchOpportunity();
    fetchUser();
  }, []);

  const userOppSignUp = async () => {
    if (!userId) {
      setUserLogin(true);
      return;
    }
    const newRecord = {
      user_id: userId,
      opportunities_id: opportunityId,
    };

    const volunteerIds = opportunity.cleanUsers.map((volunteer) => {
      return volunteer.id;
    });

    if (volunteerIds.includes(Number(userId))) {
      console.log(`user ${userId} already exists`);
      return;
    }

    try {
      await axios.post(
        `${apiUrl}:${port}/opportunities/signup/${opportunityId}`,
        newRecord
      );
      fetchOpportunity();
    } catch (error) {
      console.error(error.message);
    }
  };

  const userOppSave = async () => {
    if (!userId) {
      return;
    }
    const newRecord = {
      user_id: userId,
      opportunities_id: opportunityId,
    };

    const alreadySaved = user.savedOpportunities.map((opp) => {
      return opp.id;
    });

    if (alreadySaved.includes(Number(opportunityId))) {
      console.log(`opp ${opportunityId} already saved`);
      return;
    }

    try {
      await axios.post(
        `${apiUrl}:${port}/opportunities/save/${opportunityId}`,
        newRecord
      );
      fetchOpportunity();
    } catch (error) {
      console.error(error.message);
    }
  };

  if (!opportunity) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <main className="opportunity">
        <div className="opportunity__back">
          <Link className="opportunity__backlink" to={"/homepage"}>
            <img src={backArrow} alt="back arrow" />
          </Link>
        </div>
        <section className="opportunity__body">
          <h1 className="opportunity__title">{opportunity.title}</h1>
          <p className="opportunity__description">{opportunity.description}</p>
          <div className="opportunity__details-container">
            <p className="opportunity__subtitles">When:</p>
            <p className="opportunity__date">
              {new Date(opportunity.date_of_opportunity).toLocaleDateString(
                "en-US",
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }
              )}
            </p>
          </div>
          <div className="opportunity__details-container">
            <p className="opportunity__subtitles">From:</p>

            <p className="opportunity__time">
              {`${timeFormatter(
                opportunity.start_time_of_opportunity
              )} to ${timeFormatter(opportunity.end_time_of_opportunity)} `}
            </p>
          </div>
          <div className="opportunity__volunteers">
            <div className="opportunity__needed">
              <p className="opportunity__subtitles">volunteers needed:</p>
              <p className="opportunity__number-needed">
                {opportunity.number_of_volunteers_needed}
              </p>
            </div>
            <div className="opportunity__current">
              <p className="opportunity__subtitles">current volunteers:</p>
              <p className="opportunity__current-number">
                {opportunity.cleanUsers.length}
              </p>
              <ul>
                {opportunity.cleanUsers.map((volunteer) => {
                  return <li key={volunteer.id}>{volunteer.first_name}</li>;
                })}
              </ul>
            </div>
          </div>
        </section>
      </main>
      <p>
        {!user ? <Link to={"/"}>login in order to sign up or save</Link> : null}
      </p>
      {user && (
        <section className="opportunity__buttons">
          <button className="opportunity__save" onClick={userOppSave}>
            save
          </button>
          <button className="opportunity__signup" onClick={userOppSignUp}>
            sign up
          </button>
        </section>
      )}
      <Link to={"/"}>{userLogin ? "Login" : ""}</Link>
    </>
  );
};

export default OpportunityPage;

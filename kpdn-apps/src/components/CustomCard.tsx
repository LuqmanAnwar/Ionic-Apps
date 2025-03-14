import React from "react";
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonButton,
} from "@ionic/react";
import { useHistory } from "react-router-dom"; // ✅ Use useHistory for React Router v5
import "./CustomCard.css";

interface Props {
  image: string;
  title: string;
  path: string;
}

const CustomCard: React.FC<Props> = ({ image, title, path }) => {
  const history = useHistory(); // ✅ Replaced `useNavigate` with `useHistory`

  return (
    <IonCard className="custom-card">
      <IonCardHeader>
        <img src={image} alt={title} className="card-image" />
        <IonCardTitle>{title}</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <IonButton
          expand="block"
          color="primary"
          onClick={() => history.push(path)} // ✅ Use `history.push(path)` instead of `navigate(path)`
        >
          View Dashboard
        </IonButton>
      </IonCardContent>
    </IonCard>
  );
};

export default CustomCard;

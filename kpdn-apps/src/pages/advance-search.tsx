import type React from "react"
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton } from "@ionic/react"
import { useHistory } from "react-router"

const AdvanceSearch: React.FC = () => {
  const history = useHistory()

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar style={{ background: "linear-gradient(90deg, #ffcc00, #ff9900)" }}>
          <IonButtons slot="start">
            <IonButton onClick={() => history.goBack()}>Back</IonButton>
          </IonButtons>
          <IonTitle style={{ textAlign: "center", fontSize: "24px", fontWeight: "bold" }}>Advanced Analytics</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <h2>Advanced Search Options</h2>
        <p>This page will contain advanced search and analytics features.</p>
      </IonContent>
    </IonPage>
  )
}

export default AdvanceSearch


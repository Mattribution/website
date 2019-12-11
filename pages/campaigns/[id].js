import { useState } from "react";
import { TextField, Button } from "@material-ui/core";
import Layout from "../../components/Layouts/LayoutDrawer";

const Campaign = props => {
  const [campaign, setCampaign] = useState(props.campaign);

  const saveCampaign = async () => {
    await fetch(`http://localhost:3001/v1/campaigns/${campaign.id}`, {
      method: "PUT",
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(campaign)
    });
  };

  return (
    <Layout>
      <h1>{campaign.name}</h1>
      <p>
        Pattern: Column {campaign.columnName} = {campaign.columnValue}
        <br />
        CostPerMonth:
        <TextField
          id="filled-number"
          label="Number"
          type="number"
          InputLabelProps={{
            shrink: true
          }}
          value={campaign.costPerMonth}
          variant="outlined"
          onChange={event => {
            console.log(campaign);
            campaign.costPerMonth = parseInt(event.target.value);
            setCampaign({ ...campaign });
          }}
        />
      </p>
      <Button variant="contained" color="primary" onClick={saveCampaign}>
        Save
      </Button>
    </Layout>
  );
};

Campaign.getInitialProps = async function({ query }) {
  let res = await fetch(`http://localhost:3001/v1/campaigns/${query.id}`);
  const campaign = await res.json();

  return { campaign };
};

export default Campaign;

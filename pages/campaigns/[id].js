import { useRouter } from "next/router";
import Layout from "../../components/Layouts/LayoutDrawer";

const Campaign = ({ campaign }) => {
  const router = useRouter();

  return (
    <Layout>
      <h1>{router.query.id}</h1>
      <p>Name: {campaign.name}</p>
      <p>
        Pattern: Column {campaign.columnName} = {campaign.columnValue}
        <br />
        CostPerMonth: {campaign.costPerMonth}
      </p>
    </Layout>
  );
};

Campaign.getInitialProps = async function() {
  let res = await fetch("http://localhost:3001/v1/campaigns/1");
  const campaign = await res.json();

  return { campaign };
};

export default Campaign;

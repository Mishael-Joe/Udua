import SettlementDetails from "../../components/settlement-details";

async function Page(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  return (
    <SettlementDetails params={params}/>
  );
}

export default Page;
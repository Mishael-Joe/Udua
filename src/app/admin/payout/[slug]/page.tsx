import SettlementDetails from "../../components/settlement-details";

function Page({ params }: { params: { slug: string } }) {
  return (
    <SettlementDetails params={params}/>
  );
}

export default Page;
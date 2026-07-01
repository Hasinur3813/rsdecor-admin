import SliderDetailsClient from "@/components/sliders/SliderDetailsClient";

export const metadata = { title: "Slider Details" };

export default async function SliderDetailsPage({ params }) {
  const { id } = await params;
  return <SliderDetailsClient sliderId={id} />;
}

import SliderFormClient from "@/components/sliders/SliderFormClient";

export const metadata = { title: "Edit Slider" };

export default async function EditSliderPage({ params }) {
  const { id } = await params;
  return <SliderFormClient id={id} mode="edit" />;
}

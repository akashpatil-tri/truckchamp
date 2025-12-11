import Button from "@/components/common/Button";
import InputField from "@/components/common/Input/page";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <Button variant="filled">Get Started</Button>
      <InputField type="text" placeholder="Enter your email" />
    </>
  );
}

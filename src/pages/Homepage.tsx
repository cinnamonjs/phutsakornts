import { useEffect, useState } from "react";
import { Chip, Switch, Spinner, Kbd, Button } from "@nextui-org/react"
import { motion } from "framer-motion";
import { staggerContainer } from '@/utils/motion'
import { Shape } from "../components/shape";
import { TypingText } from "../components/Text";
import { Gitcard, ImageCard } from "../components/gitcard";
import { Gitmenu } from "../components/gitmenu";
import { textVariant } from "../utils/motion";
import { MdArrowRight } from "react-icons/md";

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible((prev) => !prev);
    }, 2700);

    return () => clearInterval(interval);
  }, []);
  return (
    <>
      {/** Background */}
      <div className='flex relative top-0 w-screen h-screen bg-gradient-to-br from-zinc-800/95 to-neutral-950 -z-20'>
        <div className=" absolute -z-10 w-screen h-screen">
          <Shape />
        </div>
        <div className="pl-[7vw] pt-24 w-[50vw]">
          <div className="p-12 w-[550px] backdrop-blur-sm">
            <Chip color="warning" variant="shadow" className="ml-2">Front-end developer</Chip>
            <motion.div className="flex flex-row mt-8 text-6xl font-bold text-white"
              variants={staggerContainer}
              initial="hidden"
              animate={isVisible ? "visible" : "hidden"}
              viewport={{ once: false, amount: 0.25 }}

            >
              I'm <TypingText textStyles="ml-4 text-6xl font-bold text-white" title="Phutsakorn" />
            </motion.div>
            <div className="mt-2 text-6xl font-bold text-white w-96">
              Thunwattanakul
            </div>
            <motion.div className="mt-8 text-white/30 w-[450px]"
              initial="hidden"
              whileInView="visible"
              variants={textVariant(0.3)}
            >
              I am currently part of the front-end development project team that works on the Management system and customer service website.
            </motion.div>
            <div>
              <Button variant="flat" radius="full" className="text-white" endContent={<MdArrowRight/>}>Github</Button>
            </div>
          </div>
        </div>
        <div className="relative w-[50w] pl-[7vw] pt-[40vh]">
          <Switch className=" absolute left-[400px] top-20"></Switch>
          <Gitcard className="absolute top-[404px] left-48 z-10" />
          <Spinner className="absolute top-[500px] left-12" size="lg" />
          <Gitmenu className="absolute top-32 w-[320px] left-4" />
          <Kbd keys={["option", "command"]} className=" absolute top-40 left-[550px] z-20">P</Kbd>
          <ImageCard className=" absolute top-36 left-[360px] z-1"/>
        </div>
      </div>
      <div className="w-screen h-screen bg-zinc-800">
          
      </div>
    </>
  )
}
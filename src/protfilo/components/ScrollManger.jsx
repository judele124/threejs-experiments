import { useFont, useScroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const ScrollManger = ({ section, setSection }) => {
    const data  = useScroll();
    const lestScroll = useRef(0);
    const isAnimation = useRef(false);

    data.fill.classList.add("top-0");
    data.fill.classList.add("absolute");

    useEffect(() => {
          gsap.to(data.el, {
              direction: 1,
              scrollTop: section * data.el.clientHeight,
              onStart: () => {isAnimation.current = true},
              onComplete: () => {isAnimation.current = false}
          })
    }, [section])

    useFrame(() => {
        if (isAnimation.current){
            lestScroll.current = data.scroll.current;
            return;
        }

        const curSecyion = Math.floor(data.scroll.current * data.pages);
        if(data.scroll.current > lestScroll.current && curSecyion === 0){
            setSection(1);
        }
        if(data.scroll.current < lestScroll.current && 
           data.scroll.current < 1 / (data.pages )){
            setSection(0);
        }
        lestScroll.current = data.scroll.current;
    })
    return null;
}

export default ScrollManger
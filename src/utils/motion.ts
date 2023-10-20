export const staggerContainer = (staggerChildren: any, delayChildren: any) => ({
    hidden: {},
    visible: {
        transition: {
            staggerChildren,
            delayChildren,
        },
    },
});

export const textContainer = {
    hidden: (i = 1) =>  ({
        y: 9,
        opacity: 0.3,
        transition: { staggerChildren: 0.1, delayChildren: i * 0.1 },
    }),
    visible: (i = 1) => ({
        y: 0,
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: i * 0.1 },
    }),
};

/** 
 * @constructor
 * @param {delay} delay - number of milliseconds
 */
export const textVariant2 = (delay: number) => ({
    hidden: (i = 1) =>  ({
        opacity: 0.2,
        transition: { staggerChildren: 0.1, delayChildren: i * 0.1 + delay },
    }),
    visible:  {
        opacity: 1,
        y: 0,
        transition: {
            type: 'tween',
            ease: 'easeIn'
        },
    },
});

export const transition = {
    type: "spring",
    duration: 0.7,
    bounce: 0.2
  };

  export const textVariant = (delay: number) => ({
    hidden: {
        y: 30,
        opacity: 0,
    },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            type: 'spring',
            duration: 1.5,
            delay,
        },
    }
})
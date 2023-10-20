import { Card, CardBody, CardFooter, Avatar, CardHeader, Button, Image } from "@nextui-org/react"

type GitCardProps = {
    className: string;
};


export const Gitcard: React.FC<GitCardProps> = ({ className }) => {
    return (
        <div className={className}>
            <Card className="max-w-[380px]">
                <CardHeader className="justify-between">
                    <div className="flex gap-5">
                        <Avatar isBordered radius="full" size="md" src="/avatars/avatar-1.png" />
                        <div className="flex flex-col gap-1 items-start justify-center">
                            <h4 className="text-small font-semibold leading-none text-default-600">First Phutsakorn</h4>
                            <h5 className="text-small tracking-tight text-default-400">p.thunwattanakul@gmail.com</h5>
                        </div>
                    </div>
                    <Button
                        className={"bg-transparent text-foreground border-default-200"}
                        color="primary"
                        radius="full"
                        size="sm"
                        variant="ghost"
                    >
                        {"Follow"}
                    </Button>
                </CardHeader>
                <CardBody className="px-3 py-0 text-small text-default-400">
                    <p>
                        Frontend developer and UI/UX enthusiast. Enjoy on Learning programming
                    </p>
                    <span className="pt-2">
                        #LearningNewThings
                        <span className="py-4 px-2" aria-label="computer" role="img">
                            💻
                        </span>
                    </span>
                </CardBody>
                <CardFooter className="gap-3">
                    <div className="flex gap-1">
                        <p className="font-semibold text-default-400 text-small">4</p>
                        <p className=" text-default-400 text-small">Following</p>
                    </div>
                    <div className="flex gap-1">
                        <p className="font-semibold text-default-400 text-small">97.1K</p>
                        <p className="text-default-400 text-small">Followers</p>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}

export const ImageCard: React.FC<GitCardProps> = ({ className }) => {
    return (
        <div className={className}>
            <Card
                isFooterBlurred
                radius="lg"
                className="border-none"
            >
                <Image
                    alt="Woman listing to music"
                    className="object-cover"
                    height={200}
                    src="/images/hero-card.jpeg"
                    width={200}
                />
                <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                    <p className="text-tiny text-white/80">Available soon.</p>
                    <Button className="text-tiny text-white bg-black/20" variant="flat" color="default" radius="lg" size="sm">
                        Notify me
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
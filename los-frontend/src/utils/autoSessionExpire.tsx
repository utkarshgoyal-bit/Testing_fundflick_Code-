import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AutoSessionExpire({ expireTime }: { expireTime: number }) {
    const [idleTime, setIdleTime] = useState(expireTime * 60);
    const navigate = useNavigate();

    useEffect(() => {
        const events = ['click', 'keydown', 'scroll', 'touchstart', 'wheel', 'mousemove'];

        const eventListener = () => setIdleTime(expireTime * 60);

        // Add event listeners for idle time reset
        events.forEach(event => document.addEventListener(event, eventListener));

        // Cleanup event listeners on component unmount
        return () => {
            events.forEach(event => document.removeEventListener(event, eventListener));
        };
    }, [expireTime]);

    useEffect(() => {
        const interval = setInterval(() => {
            setIdleTime((prevTime) => {
                if (prevTime > 0) {
                    const newTime = prevTime - 1;

                    return newTime;
                } else {
                    localStorage.clear();
                    navigate('/login');
                    clearInterval(interval);
                    return 0;
                }
            });
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, [navigate]);


    return (
        <>
            <Dialog open={idleTime < 10} onOpenChange={() => setIdleTime(expireTime * 60)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Attention ! Your session is about to expire</DialogTitle>
                        <DialogDescription>
                            This session is expired in {idleTime} seconds
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            onClick={() => setIdleTime(expireTime * 60)}
                        >
                            Reset
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </>
    );
}

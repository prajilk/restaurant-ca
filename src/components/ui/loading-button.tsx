import { Loader2 } from "lucide-react";
import { Button } from "./button";
import { ButtonHTMLAttributes } from "react";

interface LoadingButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    isLoading: boolean;
}

const LoadingButton: React.FC<LoadingButtonProps> = ({
    isLoading,
    children,
    ...props
}) => {
    return (
        <Button {...props}>
            {isLoading ? <Loader2 className="animate-spin" /> : children}
        </Button>
    );
};

export default LoadingButton;

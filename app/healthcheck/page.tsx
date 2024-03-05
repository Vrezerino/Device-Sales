import { healthCheck } from "../lib/data";

const HealthCheck = async () => {
    const response = await healthCheck();
    return (
        <html>
            <body>
                <div>
                {response.status}
                </div>
            </body>
        </html>
    )
};

export default HealthCheck;
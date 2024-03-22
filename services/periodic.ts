import { NextResponse } from "next/server";

export const healthCheck = async () => {
    return NextResponse.json({ status: 'ok' });
};
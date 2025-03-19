import * as ping from "ping";
import { MongoClient } from "mongodb";
import * as os from "os";
import "dotenv/config";

const getDeviceIp = (): string | null => {
  for (const iface of Object.values(os.networkInterfaces()).flat()) {
    if (iface && !iface.internal && iface.family === "IPv4")
      return iface.address;
  }
  return null;
};

const checkDeviceOnline = async (ip: string): Promise<boolean> =>
  (await ping.promise.probe(ip)).alive;

const updateDeviceStatus = async (deviceName: string, status: boolean) => {
  const client = new MongoClient(process.env.MONGO_URI as string);
  try {
    await client.connect();
    await client
      .db("heartbeat")
      .collection("devices")
      .updateOne(
        { name: deviceName },
        { $set: { status, lastUpdated: new Date() } },
        { upsert: true }
      );
  } catch (err) {
    console.error("Error updating MongoDB:", err);
  } finally {
    await client.close();
  }
};

const main = async () => {
  const deviceIp = getDeviceIp();
  if (!deviceIp) return console.error("Could not determine device IP address.");

  const deviceName = os.hostname();

  while (true) {
    await updateDeviceStatus(deviceName, await checkDeviceOnline(deviceIp));
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }
};

main().catch((err) => console.error("Error in main loop:", err));

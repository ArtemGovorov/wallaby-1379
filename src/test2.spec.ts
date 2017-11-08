import { RealtimeApi } from "./test2";

it("Strange error", async () => {
    const t = new RealtimeApi();

    const res = await t.sendAction("abc");
    expect(res).toBe("success");
});
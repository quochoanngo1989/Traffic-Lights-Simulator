export function getRotatedMaxtrix(roll, pitch, yaw){
    const row_0 = [
        Math.cos(pitch) * Math.cos(yaw),
        Math.sin(roll) * Math.sin(pitch) * Math.cos(yaw) - Math.cos(roll) * Math.sin(yaw),
        Math.cos(roll) * Math.sin(pitch) * Math.cos(yaw) + Math.sin(roll) * Math.sin(yaw)];

    const row_1 = [
        Math.cos(pitch) * Math.sin(yaw),
        Math.sin(roll) * Math.sin(pitch) * Math.sin(yaw) + Math.cos(roll) * Math.cos(yaw),
        Math.cos(roll) * Math.sin(pitch) * Math.sin(yaw) - Math.sin(roll) * Math.cos(yaw)];
    const row_2 = [
        -Math.sin(pitch),
        Math.sin(roll) * Math.cos(pitch),
        Math.cos(roll) * Math.cos(pitch)];
    return [row_0, row_1, row_2]; // Direction Cosine Matrix
}
export function rotationBasedOnRollPitchYaw(DCM, point){
    let rotatedPoint = [];
    for (var i = 0; i < DCM.length; i++) {
        let e = 0;
        for (var j = 0; j < DCM[i].length; j++) {
            e += point[j] * DCM[i][j];
        }
        rotatedPoint.push(e);
    }
    return rotatedPoint;
}
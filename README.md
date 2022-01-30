# red-regatta

Repurposing AS3 [Red]Regatta into a typescript library

Followed directions from here https://khalilstemmler.com/blogs/typescript/node-starter-project/#:~:text=Compiling%20our%20TypeScript%20To%20compile%20our%20code%2C%20we%27ll,to%20generate%20the%20compiled%20JavaScript%20code.%20npx%20tsc

## Course

```
export { CourseLayout } from'./CourseLayout';
export { CourseLeg } from'./CourseLeg';
export { CourseMark } from'./CourseMark';
export { Layline } from'./Layline';
export { Laylines } from'./Laylines';
export { RaceCourse } from'./RaceCourse';
export { RaceStatus } from'./RaceStatus';
```

## Data
```
export { AIS } from'./AIS';
export { AISTarget } from'./AISTarget';
export { GPSPoint } from'./GPSPoint';
export { GPX } from './GPX';
export { NMEA } from'./NMEA';
export { NMEAEvent } from'./NMEAEvent';
export { SailPoint } from'./SailPoint';
export { SailPointEvent } from'./SailPointEvent';
export { Vessel } from'./Vessel';
export { VesselStatus } from'./VesselStatus';
```

## Performance
```
export { OffWindTarget } from './OffWindTarget';
export { PerformancePoint } from './PerformancePoint';
export { Polars } from './Polars';
export { PolarTarget } from './PolarTarget';
```

## RC
```
export { Action } from './Action';
export { RCMark } from './RCMark';
```

## Track
```
export { TrackLogger } from './TrackLogger';
export { TrackSegment } from './TrackSegment';
```

## Utilities
```
export { Angles } from'./Angles';
export { Bearing } from'./Bearing';
export { DateAndTime } from'./DateAndTime';
export { Distance } from'./Distance';
export { EuclideanVector } from'./EuclideanVector';
export { Numeric } from'./Numeric';
export { Point } from'./Point';
export { RunningAverage } from'./RunningAverage';
export { RunningWindAverage } from'./RunningWindAverage';
export { VectorMath } from'./VectorMath';
```

## NOAA

```
export {NoaaStation} from './NoaaStation';
export {NoaaStationList} from './NoaaStationList';
export {Owner} from './Owner';

```
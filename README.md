# red-regatta

Repurposing AS3 [Red]Regatta into a typescript library

## Revision History

## V1.7
    - added partNumber element to MaintenanceModule
    - Added GGA sentence to NMEA
    - Fixed timestamp problem on StandingOrders
    - added category to LogEntry
    - added date to watchblock

## V1.6
    - refactored Watch class to allow reserved slots instead of just captain's hour
    - redid all logic to rely on a single routine that will get the watch info for a specific date
    - added GGA sentence 

## V1.5
    - Introduced NetworkPort to CruiseConfig class. We are now able to read NMEA0183 and NMEA2000
    - consolidate all port configuration into a single one (type, direction, protocol )
    - changed dstLog to a single entry (was array)
    - watch schedule now includes start hour

### V1.4

    - moved CruiseConfig classes
    - minor fix for NMEA.useGPSTime logic (1.4.2)
    - configuration now support backup of log file (1.4.4)

### V1.3

- Added Cruise-Contol Classes. 
- Date bug fix in parseNMEATimeAndDate. 
- Fix bug with GPS time not getting stored in SailPoint. 
- Replaced AS3 events with NodeJS EventEmitter. 
- Replaced substr with substring. 
- Minor tweaks.

### V1.2

Added cruise classes to support [Red]Cruiser


### V1.1.0

Library design to compile into ./lib and d.ts file generated using the declaration=true in tsconfig.json

Library still uses deprecated .substr at some point it needs to move to .substring but that needs to be done with care and TESTING

### V1.0.0
Initial migration

## UI

dList -- single list of strings with add, sort & delete
dGauge -- displays a value with a title and a unit. Flashes warning

## Cruise
Cruise -- Class to encapsulate cruise parameters

ShipLog -- encapsulates all ship log issues
LogEntry -- Class for making ship log files

MaintenanceLog -- encapsulates al maintenance related issues
Equipment -- represents a maintainable component on boat
MaintenanceAction -- a maintenance action

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
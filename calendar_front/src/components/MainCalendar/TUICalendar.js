import React, { useCallback, useEffect, useRef, useState } from 'react';
import { styled } from 'styled-components';

import Header from '../Header';
import SearchInfo from './SearchInfo';

import Calendar from '@toast-ui/react-calendar';
import { TZDate } from '@toast-ui/calendar';
import '@toast-ui/calendar/dist/toastui-calendar.min.css';
import 'tui-date-picker/dist/tui-date-picker.css';
import 'tui-time-picker/dist/tui-time-picker.css';
import { theme } from './theme';
import { addDate, addHours, subtractDate } from './utils';

const today = new TZDate();
const viewModeOptions = [
  {
    title: 'Monthly',
    value: 'month',
  },
  {
    title: 'Weekly',
    value: 'week',
  },
  {
    title: 'Daily',
    value: 'day',
  },
];

const CalendarContainer = styled.div`
  width: 70vw;
  display: flex;
  height: 90vh;
`;
const ShowMenuBar = styled.div`
  display: flex;
  flex-direction: column;
  border-right: 1px solid rgb(235, 237, 239);
  width: 18%;
  border-radius: 40px 0 0 40px;
`;
const ShowMenuBarHeader = styled.div`
  height: 28px;
  border-bottom: 1px solid rgb(235, 237, 239);
  font-size: 22px;
  color: grey;
  text-align: center;
  padding-top: 8px;
  margin-bottom: 22px;
`;

const TeamList = styled.label`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 6px;
`;
const Input = styled.input`
  opacity: 1;
  -webkit-appearance: none;
  cursor: pointer;
  height: 25px;
  width: 25px;
  box-shadow:
    -10px -10px 10px rgba(255, 255, 255, 0.8),
    10px 10px 10px rgba(0, 0, 70, 0.18);
  border-radius: 50%;
  border: 2px solid rgb(235, 237, 239);
  outline: none;

  transition: 0.5s;
  &:checked {
    box-shadow:
      -10px -10px 10px rgba(255, 255, 255, 0.2),
      10px 10px 10px rgba(70, 70, 70, 0.12),
      inset -10px -10px 10px rgba(255, 255, 255, 0.6),
      inset 10px 10px 10px rgba(70, 70, 70, 0.12);
    transition: 0.5s;
    background-color: ${(props) => props.bgColor};
  }
`;
const MIDContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;
const CalendarBox = styled.div`
  width: 100%;
  height: 76vh;
  margin-left: 3%;
`;
const CalendarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 10%;
  font-size: 30px;
  color: darkgrey;
`;

const initialCalendars = [
  {
    id: '0',
    name: 'team1',
    backgroundColor: '#9e5fff',
    borderColor: '#9e5fff',
    dragBackgroundColor: '#9e5fff',
  },
  {
    id: '1',
    name: 'team2',
    backgroundColor: '#00a9ff',
    borderColor: '#00a9ff',
    dragBackgroundColor: '#00a9ff',
  },
  {
    id: '2',
    name: 'team3',
    backgroundColor: '#e678f5',
    borderColor: '#e678f5',
    dragBackgroundColor: '#e678f5',
  },
  {
    id: '3',
    name: 'team4',
    backgroundColor: '#f5a078',
    borderColor: '#f5a0785',
    dragBackgroundColor: '#f5a078',
  },
  {
    id: '4',
    name: 'team5',
    backgroundColor: '#f5e478',
    borderColor: '#f5e478',
    dragBackgroundColor: '#f5e478',
  },
];
const initialEvents = [
  {
    id: '1',
    calendarId: '0',
    title: 'TOAST UI Calendar Study',
    category: 'time',
    start: today,
    end: addHours(today, 3),
  },
  {
    id: '2',
    calendarId: '1',
    title: 'Practice',
    category: 'milestone',
    start: addDate(today, 1),
    end: addDate(today, 1),
    isReadOnly: true,
  },
  {
    id: '3',
    calendarId: '2',
    title: 'FE Workshop',
    category: 'allday',
    start: subtractDate(today, 2),
    end: subtractDate(today, 1),
    isReadOnly: true,
  },
  {
    id: '4',
    calendarId: '3',
    title: 'Report',
    category: 'time',
    start: today,
    end: addHours(today, 1),
  },
];

export default function TUICalendar({
  view,
  events,
  setEvents,
  setSelectedEvent,
}) {
  const [selectedCalendars, setSelectedCalendars] = useState(
    initialCalendars.map((calendar) => ({
      ...calendar,
      isChecked: true, // 선택 상태를 초기화합니다.
    })),
  );
  const filteredEvents = initialEvents.filter(
    (event) =>
      selectedCalendars.find((calendar) => calendar.id === event.calendarId)
        ?.isChecked,
  );

  const calendarRef = useRef(null);
  const [selectedDateRangeText, setSelectedDateRangeText] = useState('');
  const [selectedView, setSelectedView] = useState(view);
  const [eventCounter, setEventCounter] = useState(5);

  const getCalInstance = useCallback(
    () => calendarRef.current?.getInstance?.(),
    [],
  );

  const updateRenderRangeText = useCallback(() => {
    const calInstance = getCalInstance();
    if (!calInstance) {
      setSelectedDateRangeText('');
    }

    const viewName = calInstance.getViewName();
    const calDate = calInstance.getDate();
    const rangeStart = calInstance.getDateRangeStart();
    const rangeEnd = calInstance.getDateRangeEnd();

    let year = calDate.getFullYear();
    let month = calDate.getMonth() + 1;
    let date = calDate.getDate();
    let dateRangeText;

    switch (viewName) {
      case 'month': {
        dateRangeText = `${year}-${month}`;
        break;
      }
      case 'week': {
        year = rangeStart.getFullYear();
        month = rangeStart.getMonth() + 1;
        date = rangeStart.getDate();
        const endMonth = rangeEnd.getMonth() + 1;
        const endDate = rangeEnd.getDate();

        const start = `${year}-${month < 10 ? '0' : ''}${month}-${
          date < 10 ? '0' : ''
        }${date}`;
        const end = `${year}-${endMonth < 10 ? '0' : ''}${endMonth}-${
          endDate < 10 ? '0' : ''
        }${endDate}`;
        dateRangeText = `${start} ~ ${end}`;
        break;
      }
      default:
        dateRangeText = `${year}-${month}-${date}`;
    }

    setSelectedDateRangeText(dateRangeText);
  }, [getCalInstance]);

  useEffect(() => {
    setSelectedView(view);
  }, [view]);

  useEffect(() => {
    updateRenderRangeText();
  }, [selectedView, updateRenderRangeText]);

  const onAfterRenderEvent = (res) => {
    console.group('onAfterRenderEvent');
    console.log('Event Info : ', res.title);
    console.groupEnd();
  };

  const onBeforeDeleteEvent = (res) => {
    console.group('onBeforeDeleteEvent');
    console.log('Event Info : ', res.title);
    console.groupEnd();

    const { id, calendarId } = res;

    getCalInstance().deleteEvent(id, calendarId);
  };

  const onChangeSelect = (ev) => {
    setSelectedView(ev.target.value);
  };

  const onClickDayName = (res) => {
    console.group('onClickDayName');
    console.log('Date : ', res.date);
    console.groupEnd();
  };

  const onClickNavi = (ev) => {
    if (ev.target.tagName === 'BUTTON') {
      const button = ev.target;
      const actionName = (
        button.getAttribute('data-action') ?? 'month'
      ).replace('move-', '');
      getCalInstance()[actionName]();
      updateRenderRangeText();
    }
  };

  const onClickEvent = (res) => {
    console.group('onClickEvent');
    console.log('MouseEvent : ', res.nativeEvent);
    console.log('Event Info : ', res.event);
    console.groupEnd();

    setSelectedEvent(res.event);
  };

  const onClickTimezonesCollapseBtn = (timezoneCollapsed) => {
    console.group('onClickTimezonesCollapseBtn');
    console.log('Is Timezone Collapsed?: ', timezoneCollapsed);
    console.groupEnd();

    const newTheme = {
      'week.daygridLeft.width': '100px',
      'week.timegridLeft.width': '100px',
    };

    getCalInstance().setTheme(newTheme);
  };

  const onBeforeUpdateEvent = (updateData) => {
    console.group('onBeforeUpdateEvent');
    console.log('Event Info: ', updateData);
    console.groupEnd();

    // 서버에 보낼 이벤트 데이터 준비
    // const eventForUpdate = {
    //   id: eventData.id,
    //   team: eventData.calendarId,
    //   title: eventData.title,
    //   description: eventData.location,
    //   start_date: eventData.start,
    //   end_date: eventData.end,
    //   state: eventData.state,
    // };

    // 업데이트 API 호출 예
    // axios.put(`url/${eventData.id}`, eventForUpdate);

    const targetEvent = updateData.event;
    const changes = { ...updateData.changes };

    getCalInstance().updateEvent(
      targetEvent.id,
      targetEvent.calendarId,
      changes,
    );
    getCalInstance().render();
  };

  const onBeforeCreateEvent = (eventData) => {
    console.log('dididi', eventData);
    // const eventForBack = {
    //   team: eventData.calendarId,
    //   title: eventData.title,
    //   description: eventData.location,
    //   start_date: eventData.start,
    //   end_date: eventData.end,
    //   state: eventData.state,
    // };
    // axios.post('url', eventForBack);
    const event = {
      calendarId: eventData.calendarId || '',
      id: String(eventCounter), //back에서 받아온 id로 변경하기
      title: eventData.title,
      isAllday: eventData.isAllday,
      start: eventData.start,
      end: eventData.end,
      category: eventData.isAllday ? 'allday' : 'time',
      dueDateClass: '',
      location: eventData.location,
      state: eventData.state,
      isPrivate: eventData.isPrivate,
    };

    setEventCounter(eventCounter + 1);
    getCalInstance().createEvents([event]);

    setEvents([...events, event]);
    setSelectedEvent(event);
  };

  return (
    <CalendarContainer>
      <ShowMenuBar>
        <ShowMenuBarHeader>Header</ShowMenuBarHeader>
        {selectedCalendars.map((calendar) => (
          <TeamList key={calendar.id}>
            <Input
              type="checkbox"
              checked={calendar.isChecked}
              bgColor={calendar.backgroundColor} //
              onChange={() => {
                const updatedCalendars = selectedCalendars.map((item) =>
                  item.id === calendar.id
                    ? { ...item, isChecked: !item.isChecked }
                    : item,
                );
                setSelectedCalendars(updatedCalendars);
              }}
            />
            {calendar.name}
          </TeamList>
        ))}
      </ShowMenuBar>
      <MIDContainer>
        <Header />
        <CalendarBox>
          <CalendarHeader>
            <div>
              <span>
                <button
                  type="button"
                  className="btn btn-default btn-sm move-day"
                  data-action="move-prev"
                  onClick={onClickNavi}
                >
                  Prev
                </button>
                <span className="render-range">{selectedDateRangeText}</span>

                <button
                  type="button"
                  className="btn btn-default btn-sm move-day"
                  data-action="move-next"
                  onClick={onClickNavi}
                >
                  Next
                </button>
              </span>
              <button
                type="button"
                className="btn btn-default btn-sm move-today"
                data-action="move-today"
                onClick={onClickNavi}
              >
                Today
              </button>
              <select onChange={onChangeSelect} value={selectedView}>
                {viewModeOptions.map((option, index) => (
                  <option value={option.value} key={index}>
                    {option.title}
                  </option>
                ))}
              </select>
            </div>
          </CalendarHeader>
          <Calendar
            height="77vh"
            calendars={selectedCalendars}
            month={{
              startDayOfWeek: 0,
              isAlways6Weeks: false,
            }}
            events={filteredEvents}
            template={{
              allday(event) {
                return `[All day] ${event.title}`;
              },
              popupIsAllday() {
                return '하루 종일';
              },
              popupSave() {
                return '저장';
              },
              titlePlaceholder() {
                return '제목';
              },
              popupStateFree() {
                return 'Done';
              },
              popupStateBusy() {
                return 'Todo';
              },
              locationPlaceholder() {
                return '세부 내용';
              },
              popupEdit() {
                return '편집';
              },
              popupDelete() {
                return '삭제';
              },
              popupUpdate() {
                return '저장';
              },
            }}
            theme={theme}
            timezone={{
              zones: [
                {
                  timezoneName: 'Asia/Seoul',
                  displayLabel: 'Seoul',
                  tooltip: 'UTC+09:00',
                },
              ],
            }}
            useDetailPopup={true}
            useFormPopup={true}
            view={selectedView}
            week={{
              showTimezoneCollapseButton: true,
              timezonesCollapsed: false,
              eventView: true,
              taskView: true,
            }}
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            ref={calendarRef}
            onAfterRenderEvent={onAfterRenderEvent}
            onBeforeDeleteEvent={onBeforeDeleteEvent}
            onClickDayname={onClickDayName}
            onClickEvent={onClickEvent}
            onClickTimezonesCollapseBtn={onClickTimezonesCollapseBtn}
            onBeforeUpdateEvent={onBeforeUpdateEvent}
            onBeforeCreateEvent={onBeforeCreateEvent}
          />{' '}
        </CalendarBox>
      </MIDContainer>
      {/* <SearchInfo /> */}
    </CalendarContainer>
  );
}

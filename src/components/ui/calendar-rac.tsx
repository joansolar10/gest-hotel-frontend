import React from 'react';
import {
  RangeCalendar as AriaRangeCalendar,
  CalendarGrid,
  CalendarGridHeader,
  CalendarHeaderCell,
  CalendarGridBody,
  CalendarCell,
  Heading,
  Button,
  RangeCalendarProps,
  CalendarCellProps
} from 'react-aria-components';

// Componente CustomCalendarCell con estilos inline
function CustomCalendarCell(props: CalendarCellProps) {
  return (
    <CalendarCell
      {...props}
      className="custom-calendar-cell"
      style={{
        textAlign: 'center',
        padding: '8px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        fontSize: '14px',
        fontWeight: '500',
        position: 'relative'
      }}
    />
  );
}

export function RangeCalendar(props: RangeCalendarProps<any>) {
  return (
    <div>
      <AriaRangeCalendar
        {...props}
        style={{
          backgroundColor: '#1a1a1a',
          color: 'white',
          borderRadius: '12px',
          padding: '16px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          ...props.style
        }}
      >
        <header style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px'
        }}>
          <Button
            slot="previous"
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              fontSize: '18px',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '6px',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            ◀
          </Button>
          <Heading style={{
            fontSize: '16px',
            fontWeight: '600',
            margin: 0
          }} />
          <Button
            slot="next"
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              fontSize: '18px',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '6px',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            ▶
          </Button>
        </header>
        <CalendarGrid style={{
          width: '100%',
          borderCollapse: 'collapse'
        }}>
          <CalendarGridHeader>
            {(day) => (
              <CalendarHeaderCell style={{
                fontSize: '13px',
                fontWeight: '600',
                color: 'rgba(255,255,255,0.6)',
                padding: '8px',
                textAlign: 'center'
              }}>
                {day}
              </CalendarHeaderCell>
            )}
          </CalendarGridHeader>
          <CalendarGridBody>
            {(date) => <CustomCalendarCell date={date} />}
          </CalendarGridBody>
        </CalendarGrid>
      </AriaRangeCalendar>
      
      <style>{`
        /* ESTILOS BASE */
        .custom-calendar-cell {
          color: white;
          background-color: transparent;
          border-radius: 6px;
        }
        
        /* RANGO MEDIO - Días entre inicio y fin */
        .custom-calendar-cell[data-selection-state="middle"] {
          background-color: rgba(255, 255, 255, 0.25) !important;
          color: white !important;
          border-radius: 0 !important;
          font-weight: 600 !important;
        }
        
        /* INICIO Y FIN DEL RANGO */
        .custom-calendar-cell[data-selected="true"],
        .custom-calendar-cell[data-selection-start="true"],
        .custom-calendar-cell[data-selection-end="true"] {
          background-color: white !important;
          color: #1a1a1a !important;
          font-weight: 700 !important;
        }
        
        /* BORDES DEL RANGO */
        .custom-calendar-cell[data-selection-start="true"]:not([data-selection-end="true"]) {
          border-radius: 6px 0 0 6px !important;
        }
        
        .custom-calendar-cell[data-selection-end="true"]:not([data-selection-start="true"]) {
          border-radius: 0 6px 6px 0 !important;
        }
        
        /* UN SOLO DÍA SELECCIONADO */
        .custom-calendar-cell[data-selection-start="true"][data-selection-end="true"] {
          border-radius: 6px !important;
        }
        
        /* HOVER */
        .custom-calendar-cell:hover:not([data-disabled]):not([data-outside-month]) {
          background-color: rgba(255, 255, 255, 0.15) !important;
        }
        
        /* DÍAS DESHABILITADOS */
        .custom-calendar-cell[data-disabled="true"] {
          color: rgba(255, 255, 255, 0.25) !important;
          cursor: not-allowed !important;
          background-color: transparent !important;
        }
        
        /* DÍAS FUERA DEL MES */
        .custom-calendar-cell[data-outside-month="true"] {
          color: rgba(255, 255, 255, 0.35) !important;
        }
        
        /* HOY */
        .custom-calendar-cell[data-today="true"]:not([data-selected="true"]) {
          position: relative;
        }
        
        .custom-calendar-cell[data-today="true"]:not([data-selected="true"])::after {
          content: '';
          position: absolute;
          bottom: 4px;
          left: 50%;
          transform: translateX(-50%);
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.6);
        }
        
        /* FOCUS (accesibilidad) */
        .custom-calendar-cell[data-focused="true"] {
          outline: 2px solid rgba(255, 255, 255, 0.5);
          outline-offset: -2px;
        }
        
        /* Asegurar que los estados se vean correctamente */
        .custom-calendar-cell[data-pressed="true"]:not([data-disabled]) {
          transform: scale(0.95);
        }
      `}</style>
    </div>
  );
}
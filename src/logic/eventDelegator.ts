export interface DelegatedEvent {
  selector: string
  eventType: string
  handler: (domEvent: Event, targetElement: Element) => void
}

export function delegateEvents(delegatedEvents: DelegatedEvent[]): void {
  const eventTypes = [
    ...new Set(delegatedEvents.map((event) => event.eventType)),
  ]

  eventTypes.forEach((eventType) => {
    const selectedEvents = delegatedEvents.filter(
      (event) => event.eventType === eventType,
    )

    const rootElement = document.getElementById('root')

    if (rootElement) {
      rootElement.addEventListener(eventType, (event) => {
        selectedEvents.forEach(({ selector, handler }) => {
          const targetElement = (event.target as Element).closest(selector)
          if (targetElement) {
            handler(event, targetElement)
          }
        })
      })
    }
  })
}

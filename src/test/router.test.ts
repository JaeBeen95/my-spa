import { useRouter, resetRouter } from '../router';

describe('Router 테스트', () => {
  let router: ReturnType<typeof useRouter>;

  beforeEach(() => {
    resetRouter();
    history.pushState({}, '', '/');
    document.body.innerHTML = '<div id="root"></div>';
    router = useRouter();
  });

  test('매칭되는 라우트가 없으면 default route 호출', () => {
    const defaultRouteMock = jest.fn(() => 'default');
    router.setDefaultRoute(defaultRouteMock);
    router.renderPage();
    expect(defaultRouteMock).toHaveBeenCalledWith({}, {});
  });

  test('동적 path 파라미터와 query 파라미터를 추출하여 view에 전달', () => {
    const routeMock = jest.fn(() => 'article');
    router.addRoute('/article/:id', routeMock);
    history.pushState({}, '', '/article/0?sort=asc');
    router.renderPage();
    expect(routeMock).toHaveBeenCalledWith({ id: '0' }, { sort: 'asc' });
  });

  test('매칭되는 라우트가 없을 경우 default route 호출', () => {
    const defaultRouteMock = jest.fn(() => 'default');
    router.setDefaultRoute(defaultRouteMock);
    history.pushState({}, '', '/abc?sort=asc');
    router.renderPage();
    expect(defaultRouteMock).toHaveBeenCalledWith({}, { sort: 'asc' });
  });

  test('popstate 이벤트 발생 시 라우팅 업데이트', () => {
    const routeMock = jest.fn(() => 'article');
    router.addRoute('/article/:id', routeMock);

    history.pushState({}, '', '/article/1?sort=asc');
    router.renderPage();
    expect(routeMock).toHaveBeenCalledWith({ id: '1' }, { sort: 'asc' });

    history.pushState({}, '', '/article/2?sort=asc');
    window.dispatchEvent(new PopStateEvent('popstate'));
    expect(routeMock).toHaveBeenLastCalledWith({ id: '2' }, { sort: 'asc' });
  });
});

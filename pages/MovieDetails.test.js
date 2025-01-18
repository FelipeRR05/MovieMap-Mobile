import { render, screen, fireEvent } from '@testing-library/react-native';
import MovieDetails from '../screens/MovieDetails';
import { useNavigation } from '@react-navigation/native';
import { useMovieDetails } from '../hooks/useMovieDetails';

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

jest.mock('../hooks/useMovieDetails', () => ({
  useMovieDetails: jest.fn(),
}));

describe('MovieDetails Component', () => {
  const mockGoBack = jest.fn();

  beforeEach(() => {
    useNavigation.mockReturnValue({
      goBack: mockGoBack,
    });
  });

  it('deve exibir "Carregando..." enquanto os detalhes estão sendo carregados', () => {
    useMovieDetails.mockReturnValue({ details: null, error: null });

    render(
      <MovieDetails route={{ params: { mediaType: 'movie', movieId: 1 } }} />
    );

    expect(screen.getByText('Carregando...')).toBeTruthy();
  });

  it('deve exibir uma mensagem de erro se os dados falharem ao carregar', () => {
    useMovieDetails.mockReturnValue({
      details: null,
      error: 'Erro ao carregar dados',
    });

    render(
      <MovieDetails route={{ params: { mediaType: 'movie', movieId: 1 } }} />
    );

    expect(screen.getByText('Erro ao carregar dados')).toBeTruthy();
  });

  it('deve renderizar os detalhes do filme corretamente', () => {
    useMovieDetails.mockReturnValue({
      details: {
        poster_path: '/poster.jpg',
        title: 'Filme de Teste',
        release_date: '2023-01-01',
        genres: [{ name: 'Ação' }],
        overview: 'Esta é uma sinopse de teste.',
        vote_average: 8.5,
        runtime: 120,
        credits: { cast: [] },
        recommendations: { results: [] },
      },
      error: null,
    });

    render(
      <MovieDetails route={{ params: { mediaType: 'movie', movieId: 1 } }} />
    );

    expect(screen.getByText('Filme de Teste')).toBeTruthy();
    expect(screen.getByText('2023')).toBeTruthy();
    expect(screen.getByText('Gêneros: Ação')).toBeTruthy();
    expect(
      screen.getByText('Sinopse: Esta é uma sinopse de teste.')
    ).toBeTruthy();
    expect(screen.getByText('120 min')).toBeTruthy();
    expect(screen.getByText('85%')).toBeTruthy();
  });

  it('deve exibir "Não disponível em streaming" quando não há provedores de streaming', () => {
    useMovieDetails.mockReturnValue({
      details: {
        poster_path: '/poster.jpg',
        title: 'Filme de Teste',
        genres: [],
        overview: '',
        vote_average: 0,
        runtime: 0,
        credits: { cast: [] },
        recommendations: { results: [] },
        'watch/providers': { results: { BR: { flatrate: [] } } },
      },
      error: null,
    });

    render(
      <MovieDetails route={{ params: { mediaType: 'movie', movieId: 1 } }} />
    );

    expect(screen.getByText('Não disponível em streaming.')).toBeTruthy();
  });

  it('deve exibir uma lista de atores quando disponível', () => {
    useMovieDetails.mockReturnValue({
      details: {
        poster_path: '/poster.jpg',
        credits: {
          cast: [
            { id: 1, name: 'Ator 1', profile_path: '/actor1.jpg' },
            { id: 2, name: 'Ator 2', profile_path: '/actor2.jpg' },
          ],
        },
        recommendations: { results: [] },
      },
      error: null,
    });

    render(
      <MovieDetails route={{ params: { mediaType: 'movie', movieId: 1 } }} />
    );

    expect(screen.getByText('Elenco')).toBeTruthy();
    expect(screen.getByText('Ator 1')).toBeTruthy();
    expect(screen.getByText('Ator 2')).toBeTruthy();
  });

  it('deve exibir uma lista de recomendações quando disponível', () => {
    useMovieDetails.mockReturnValue({
      details: {
        recommendations: {
          results: [
            { id: 1, title: 'Recomendação 1', poster_path: '/rec1.jpg' },
            { id: 2, title: 'Recomendação 2', poster_path: '/rec2.jpg' },
          ],
        },
        credits: { cast: [] },
      },
      error: null,
    });

    render(
      <MovieDetails route={{ params: { mediaType: 'movie', movieId: 1 } }} />
    );

    expect(screen.getByText('Títulos semelhantes')).toBeTruthy();
    expect(screen.getByText('Recomendação 1')).toBeTruthy();
    expect(screen.getByText('Recomendação 2')).toBeTruthy();
  });

  it('deve chamar a função goBack ao realizar o gesto de pan', () => {
    useMovieDetails.mockReturnValue({
      details: {
        poster_path: '/poster.jpg',
        credits: { cast: [] },
        recommendations: { results: [] },
      },
      error: null,
    });

    const { getByTestId } = render(
      <MovieDetails route={{ params: { mediaType: 'movie', movieId: 1 } }} />
    );

    const panGestureHandler = getByTestId('pan-gesture-handler');
    fireEvent(panGestureHandler, 'onGestureEvent', {
      nativeEvent: { translationX: 100 },
    });

    expect(mockGoBack).toHaveBeenCalled();
  });
});

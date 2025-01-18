import { render, screen, fireEvent } from '@testing-library/react-native';
import MovieCard from '../components/MovieCard';
import { useFavorites } from '../hooks/useFavorites';
import { useNavigation } from '@react-navigation/native';

jest.mock('../hooks/useFavorites', () => ({
  useFavorites: jest.fn(),
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

describe('MovieCard Component', () => {
  const mockToggleFavorite = jest.fn();
  const mockNavigate = jest.fn();

  beforeEach(() => {
    useFavorites.mockReturnValue({
      isFavorite: false,
      toggleFavorite: mockToggleFavorite,
    });

    useNavigation.mockReturnValue({
      navigate: mockNavigate,
    });
  });

  it('deve renderizar o componente com os dados corretos', () => {
    const movieDetails = {
      movieId: 1,
      mediaType: 'movie',
      poster_path: '/poster.jpg',
      title: 'Filme de Teste',
      vote_average: 8.5,
      release_date: '2023-01-01',
      genres: [{ name: 'Ação' }],
    };

    render(<MovieCard {...movieDetails} />);

    expect(screen.getByText('Filme de Teste')).toBeTruthy();
    expect(screen.getByText('Ação - 2023')).toBeTruthy();

    expect(screen.getByText('85%')).toBeTruthy();

    const image = screen.getByRole('image');
    expect(image.props.source.uri).toBe(
      'https://image.tmdb.org/t/p/w200/poster.jpg'
    );
  });

  it('deve exibir o botão de favoritos e reagir ao clique', () => {
    const movieDetails = {
      movieId: 1,
      mediaType: 'movie',
    };

    render(<MovieCard {...movieDetails} />);

    const favoriteButton = screen.getByRole('button');
    fireEvent.press(favoriteButton);

    expect(mockToggleFavorite).toHaveBeenCalled();
  });

  it('deve navegar para a tela de detalhes ao clicar no card', () => {
    const movieDetails = {
      movieId: 1,
      mediaType: 'movie',
      title: 'Filme de Teste',
    };

    render(<MovieCard {...movieDetails} />);

    const card = screen.getByText('Filme de Teste');
    fireEvent.press(card);

    expect(mockNavigate).toHaveBeenCalledWith('MovieDetails', {
      mediaType: 'movie',
      movieId: 1,
    });
  });

  it('deve exibir "Carregando..." se os detalhes do filme ainda não estão disponíveis', () => {
    render(<MovieCard movieId={1} mediaType="movie" />);

    expect(screen.getByText('Carregando...')).toBeTruthy();
  });

  it('deve exibir um placeholder se o poster não estiver disponível', () => {
    const movieDetails = {
      movieId: 1,
      mediaType: 'movie',
      title: 'Filme Sem Poster',
    };

    render(<MovieCard {...movieDetails} />);

    expect(screen.getByText('Filme Sem Poster')).toBeTruthy();
    expect(screen.getByRole('image').props.source).toBeUndefined();
  });
});

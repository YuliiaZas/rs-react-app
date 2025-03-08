import { ErrorComponent } from '@lib';
import { text } from '@utils';

export default function ErrorPage() {
  return (
    <ErrorComponent
      errorMessage={text.notFoundPage.errorMessage}
      errorMessageInfo={text.notFoundPage.errorMessageInfo}
      showButton={true}
    />
  );
}

import React                           from 'react'; 
import { RouteComponentProps }         from 'react-router-dom';
import { MainContextValue }            from '../../../interfaces';
import { HeroSection }                 from './HeroSection';
import { ResponsiveCurriculumSection } from './ResponsiveCurriculumSection';
import { ContinuousPDSection }         from './ContinuousPDSection';
import { InquirySection }              from './InquirySection';
import { Footer }                      from './Footer';


interface HomePageProps extends RouteComponentProps  {
  value: MainContextValue;
}


export function HomePage(props: HomePageProps): React.ReactElement | null {
  return (
    <div className="flex-grow-1">  
      <HeroSection />
      <ResponsiveCurriculumSection />
      <ContinuousPDSection />
      <InquirySection />
      <Footer />  
    </div>
  );
}
